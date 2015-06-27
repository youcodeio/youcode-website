// app.js
var routerApp = angular.module('youcodeio', ['ui.router',
                                            'youcodeio.controllers.search',
                                            'youcodeio.controllers.channels',
                                            'youcodeio.services',
                                            'youcodeio.controllers.header',
                                            'youcodeio.controllers.conf',
                                            'youcodeio.controllers.data',
                                            'youcodeio.controllers.about']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('header', {
            templateUrl: 'partials/header.html',
            controller: 'HeaderCtrl'
        })

        .state('header.welcome', {
            url:'/home',
            templateUrl: 'partials/welcome.html'
            })

        .state('header.search', {
            url:'/search?query?isTuts',
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
            })
        
        .state('channels', {
            url: '/channels',
            templateUrl: 'partials/channels.html',
            controller: 'ChannelsCtrl'
        })  

        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html',
            controller: 'AboutCtrl'
        })

        .state('data', {
            url: '/data',
            templateUrl: 'partials/data.html',
            controller: 'DataCtrl'
        })

        .state('conferences', {
            url: '/conferences',
            templateUrl: 'partials/conferences.html',
            controller: 'ConfCtrl'
        })
        
});

// Upon loading, the Google APIs JS client automatically invokes this callback and 
// start AngularJS
googleApiClientReady = function() {
    angular.bootstrap(document.body, ['youcodeio']);
}