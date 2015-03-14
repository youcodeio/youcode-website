var myApp = angular.module('youcodeio',[]);

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q,$scope) {

	var APIKEY = "KEY";

	var deferred = $q.defer();

// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function (q,id) {
	gapi.client.setApiKey(APIKEY);
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
					resolve(response);
				});
			});
		});
	});
};

}]);

myApp.controller('Ctrl', function ($q,$scope,googleService) {
	$scope.channels = [];

	$scope.search = function (){
		var savePromises = [];
		$scope.unicorn = true;
		angular.forEach(youtube_channels, function(value,key) {
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
		$scope.unicorn = false;
	};

	$scope.formatDate = function (date){
		return 	moment(date.getTime(), "x").fromNow();
	}

});
