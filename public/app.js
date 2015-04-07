'use strict';

angular.module('dash',['ui.router','dash.controllers','dash.services','dash.directives', 'ui.calendar'])

.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");	

	$stateProvider
		.state('dash',{
			url: '/',
			views: {
				'header': {
					templateUrl : 'partials/header.html'
				},
				'sidebar': {
					templateUrl: 'partials/sidebar.html'
				},
				'content': {
					templateUrl: 'partials/dash.html',
					controller: 'weatherCtrl'
				}
			}
		})
		.state('dash.settings',{
			url:'settings',
			views: {
				'content@': {
					templateUrl: 'partials/settings.html',
					controller: 'settingsCtrl'
				}
			}
		})
		.state('dash.login',{
			url:'login',
			views: {
				'header@' : {

				},
				'sidebar@': {

				},
				'content@': {
					templateUrl: 'partials/login.html',
					controller: 'loginCtrl'
				}
			}
		})
})

.run(function($rootScope, $location){
	// $rootScope.currentLocation = $location;
	// console.log($rootScope.currentLocation.path());
	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){
			$rootScope.currentLocation = toState.name;
			console.log(toState);
	})
});

