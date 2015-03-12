app.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

var APIKEY = "AIzaSyAIeH8yXYHJfO6S4JrXAIJFFZ-lKlGn3EA";

var deferred = $q.defer();
// Upon loading, the Google APIs JS client automatically invokes this callback.
this.handleClientLoad = function () {
    gapi.client.setApiKey(APIKEY);
    gapi.auth.init(function() {
        window.setTimeout(this.loadAPIClientInterfaces, 1);
    });
};


this.loadAPIClientInterfaces = function () {
    gapi.client.load('youtube', 'v3', function() {

        request = gapi.client.youtube.search.list({
            part: 'snippet',
            channelId: 'UCqhNRDQE_fqBDBwsvmT8cTg',
            order: 'date',
            type: 'video'

        });

        request.execute(function(response) {
            deferred.resolve(data);

        });
    });

    return deferred.promise;
}}]);
