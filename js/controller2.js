var myApp = angular.module('youcodeio',['ngAnimate']);

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
					type: 'video', 
					maxResults: '2'
				});
				request.execute(function(response) {
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
		$scope.channels = youtube_channels;
		angular.forEach($scope.channels, function(value, key){
			savePromises[key] = googleService.handleClientLoad($scope.query,value.id);
			$scope.parsingResults(savePromises[key]);
			$scope.channels[key] = {name: $scope.channels[key].name, id: $scope.channels[key].id, videos: savePromises[key]};
		});
	}

	$scope.parsingResults = function (data){
		videos = [];
		angular.forEach(data, function(value) {
			angular.forEach(value.item, function(result){
				result.snippet.publishedAt = new Date(result.snippet.publishedAt);
				result.snippet.id = result.id.videoId;
				videos.push(result.snippet);	
			});
			
		});
		videos.sort(function(a, b) {
			a = a.publishedAt;
			b = b.publishedAt;
			return a>b ? -1 : a<b ? 1 : 0;
		});
		$scope.unicorn = false;
	};
});

