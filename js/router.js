// app.js
var routerApp = angular.module('youcodeio', ['ui.router','youcodeio.controllers.welcome','youcodeio.controllers.channels','youcodeio.services']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('welcome', {
            url: '/',
            templateUrl: 'partials/welcome.html',
            controller: 'WelcomeCtrl'
        })
        
        .state('channels', {
            url: '/channels',
            templateUrl: 'partials/channels.html',
            controller: 'ChannelsCtrl'
        })        
        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html'
        })
        
});