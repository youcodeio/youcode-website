var myApp = angular.module('youcodeio',[]);

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

	var APIKEY = "Wow, such a great API";

	var deferred = $q.defer();
// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function (q,id) {
	gapi.client.setApiKey(APIKEY);
	console.log("requete pour" + id + "avec le mot clé "+q);
	gapi.auth.init(function() {
		gapi.client.load('youtube', 'v3', function() {

			request = gapi.client.youtube.search.list({
			q: q,
			part: 'snippet',
			channelId: id,
			order: 'date',
			type: 'video'

		});
			request.execute(function(response) {
				deferred.resolve(response);
			});
		});
	});
	return deferred.promise;
};

}]);


myApp.controller('Ctrl', function ($q,$scope,googleService) {
	$scope.channels = [];

	$scope.search = function (){
		var savePromises = [];

		angular.forEach(youtube_channels, function(value,key) {
			savePromises[key] = googleService.handleClientLoad($scope.query,value.id);
		});
		console.log(savePromises);

		$q.all(savePromises).then(
			function success(results){
				$scope.parsingResults(results);
			},
			function failed(results){console.log(results)}
			);
	}
	$scope.parsingResults = function (data){
		var videos = [];
		$scope.channels = [];
		console.log(data);
		angular.forEach(data, function(value,key) {
			angular.forEach(value.items, function(result) {
				videos.push(result.snippet);

			});
		});
		$scope.channels = videos;
	};
	});
