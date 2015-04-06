angular.module('youcodeio.services', [])
.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q,$scope) {

	var deferred = $q.defer();

// Upon loading, the Google APIs JS client automatically invokes this callback.
this.searchVideo = function (q,id) {
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
					type: 'video',
					maxResults: '50'
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

this.searchLastTwovideos = function (q,id,name) {
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
						q: "",
						part: 'id,snippet',
						channelId: id,
						order: 'date',
						type: 'video', 
						maxResults: 2
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