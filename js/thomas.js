var myApp = angular.module('youcodeio',[]);

myApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

	var APIKEY = "AIzaSyAIeH8yXYHJfO6S4JrXAIJFFZ-lKlGn3EA";

	var defList = [];
// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function () {
	var self = this;
	_.fill(defList, $q.defer().promise, 0, youtube_channels.length);
	gapi.client.setApiKey(APIKEY);
	gapi.auth.init(function() {
		for (var i = youtube_channels.length - 1; i >= 0; i--) {
			defList[i] = self.loadAPIClientInterfaces(youtube_channels[i].id);
		};
	});
	return defList;
};

this.loadAPIClientInterfaces = function (id) {
	var deferred = $q.defer();

	gapi.client.load('youtube', 'v3', function() {

		request = gapi.client.youtube.search.list({
			//q: q,
			part: 'snippet',
			channelId: id,
			order: 'date',
			type: 'video'

		});
		request.execute(function(response) {
			deferred.resolve(response);
		});
	});
	return deferred.promise;
}}]);


myApp.controller('Ctrl', function ($scope,googleService) {
	$scope.channels = [];
	
	$scope.getChannel = function () {
		var google = googleService.handleClientLoad();
		$.when.apply($, google).then(function (data) {
			console.log(data);
			console.log("avant then");
			data.then(function(data){
				console.log("après then");
				console.log(data);
				$scope.channels.push(data.items);
			},
			function(err){
				console.log(err);
			})
		}, function (error) {
			console.log('Failed: ' + error)
		});
	};
});
