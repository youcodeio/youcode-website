var myApp = angular.module('youcodeio',['ngAnimate']);

toast('This is currently a beta version, please tell us what you think on  <a href="https://twitter.com/you_codeio" class="toast_beta" target="_blank"> Twitter</a>', 7000, 'rounded'); // 'rounded' is the class I'm applying to the toast

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q,$scope) {

	var deferred = $q.defer();

// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function (q,id) {
	if (window.APIKEY == "KEY") {
		toast("You forget to set the key moron!", 3000, 'rounded');
		return;
	}else{
		gapi.client.setApiKey(window.APIKEY);
	};
	
	return $q(function(resolve, reject) {
		gapi.auth.init(function() {
			gapi.client.load('youtube', 'v3', function() {

				request = gapi.client.youtube.search.list({
					q: q,
					part: 'id,snippet',
					channelId: id,
					order: 'date',
					type: 'video'
				});
				request.execute(function(response) {
					if ('error' in response) {
						 toast('Error '+response.error.code+": "+response.error.message, 3000, 'rounded');
					} else{
						resolve(response);
					};
				});
			});
		});
	});
};

}]);

myApp.controller('Ctrl', function ($q,$scope,googleService) {

	$scope.channels = [];
	$scope.isTuts = false;
	$scope.showAbout = true;
	$scope.query = "";
	$scope.last_query = "";
	$scope.isNull = false;
    $scope.show = false;

	$scope.search = function (){

		if ($scope.query == '') {
			$scope.showAbout = true;
			return;
		}
		$scope.isNull = false;
		var savePromises = [];
		$scope.unicorn = true;
		$scope.showAbout =  false;
		
		if ($scope.isTuts) {
			var requests = youtube_tuts;
		} else{
			var requests = youtube_talks;
		};

		angular.forEach(requests, function(value,key) {
			savePromises[key] = googleService.handleClientLoad($scope.query,value.id);

		});
		$q.all(savePromises).then(function(data){
			$scope.parsingResults(data);
		});
	}

	$scope.parsingResults = function (data){
		var videos = [];
		$scope.channels = [];

		angular.forEach(data, function(value,key) {
			angular.forEach(value.items, function(result) {
				result.snippet.publishedAt = new Date(result.snippet.publishedAt);
				result.snippet.id = result.id.videoId;
				videos.push(result.snippet);
			});
		});
		$scope.channels = videos;
		$scope.channels.sort(function(a, b) {
			a = a.publishedAt;
			b = b.publishedAt;
			return a>b ? -1 : a<b ? 1 : 0;
		});

		if ($scope.channels.length == 0) {
			$scope.last_query = $scope.query;
			$scope.isNull = true;
		}

		$scope.unicorn = false;
	};

	$scope.formatDate = function (date){
		return 	moment(date.getTime(), "x").fromNow();
	};

	$scope.startSearch = function (name) {

		$( "#poney" ).addClass( "active" );
		$( "#amazing_poney" ).addClass( "active" );
		$scope.query = name;
		$scope.search();
	}
	$scope.changeToggle = function () {
		$scope.isTuts = !$scope.isTuts;
		$scope.search();
	}

});
