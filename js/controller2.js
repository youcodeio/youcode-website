// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
    var scope = angular.element(document.getElementsByTagName("body")).scope();
    scope.$apply(function () {
        scope.initiate();
    });
}

var myApp = angular.module('youcodeio',['ngAnimate']);

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q,$scope) {

	var APIKEY = "KEY";

	var deferred = $q.defer();

// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function (q,id,name) {
	gapi.client.setApiKey(APIKEY);
	return $q(function(resolve, reject) {
		gapi.auth.init(function() {
			gapi.client.load('youtube', 'v3', function() {

				request = gapi.client.youtube.search.list({
					q: q,
					part: 'id,snippet',
					channelId: id,
					order: 'date',
					type: 'video', 
					maxResults: '2'
				});
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

		var savePromises = [];
		$scope.unicorn = true;
		requests = youtube_talks;
		requests = requests.concat(youtube_tuts);

		requests.sort(function(a, b){
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		})

		angular.forEach(requests, function(value,key) {
			savePromises[key] = googleService.handleClientLoad($scope.query,value.id,value.name);
		});
		$q.all(savePromises).then(function(data){
			$scope.parsingResults(data);
		});
	}

	$scope.parsingResults = function (data){
		$scope.channels = [];

		var videos = [];

		console.log(data);

		angular.forEach(data, function(value,key) {
			$scope.channels[key] = {
					channel_name:value.channel_name,
					channel_video: []
				};
			angular.forEach(value.items, function(result,key2){
			$scope.channels[key].channel_video.push(result.snippet);
			});
		});
		$scope.unicorn = false;
	};
});

