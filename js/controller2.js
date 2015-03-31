toast('This is currently a beta version, please tell us what you think on  <a href="https://twitter.com/you_codeio" class="toast_beta" target="_blank"> Twitter</a>', 7000, 'rounded'); // 'rounded' is the class I'm applying to the toast


// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
    var scope = angular.element(document.getElementsByTagName("body")).scope();
    scope.$apply(function () {
        scope.initiate();
    });
}

var myApp = angular.module('youcodeio',['ngAnimate']);

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q,$scope) {

	var deferred = $q.defer();

// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function (q,id,name) {
	gapi.client.setApiKey(window.APIKEY);
	return $q(function(resolve, reject) {
		gapi.auth.init(function() {
			var request = "";
			gapi.client.load('youtube', 'v3', function() {
				if(q == 1){
					request = gapi.client.youtube.channels.list({
						part: "brandingSettings,snippet",
						id: id
					});
				}
				else if(q == 2){
					request = gapi.client.youtube.search.list({
						q: q,
						part: 'id,snippet',
						channelId: id,
						order: 'date',
						type: 'video', 
						maxResults: '2'
					});
				}
				request.execute(function(response) {
					response.channel_name = name;
					resolve(response);
				});
			});
		});
	});
};

}]);

myApp.controller('Ctrl', function ($q, $scope, googleService) {
	$scope.channels = [];
	$scope.query = "";

	$scope.initiate = function(){

		var banners = [];
		var savePromises = [];
		$scope.unicorn = true;
		requests = youtube_talks;
		requests = requests.concat(youtube_tuts);

		requests.sort(function(a, b){
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		})

		angular.forEach(requests, function(value, key){
			banners[key] = googleService.handleClientLoad(1, value.id, value.name)
		});
		$q.all(banners).then(function(d){
			angular.forEach(requests, function(value,key) {
				savePromises[key] = googleService.handleClientLoad(2,value.id,value.name);
			});
			$q.all(savePromises).then(function(data){
				$scope.parsingResults(data, d);
			});
		});
	}

	$scope.parsingResults = function (data, d){
		$scope.channels = [];

		var videos = [];

		angular.forEach(data, function(value,key) {
			$scope.channels[key] = {
					channel_name:d[key].items[0].snippet.title,
					channel_logo: d[key].items[0].snippet.thumbnails.high,
					channel_banner: d[key].items[0].brandingSettings.image.bannerImageUrl,
					channel_video: []
				};
			angular.forEach(value.items, function(result,key2){
			$scope.channels[key].channel_video.push(result.snippet);
			});
		});
		$scope.unicorn = false;
        console.log($scope.channels);
	};
});

