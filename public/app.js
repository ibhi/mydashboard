'use strict';

angular.module('dash',['ui.router','dash.controllers','dash.services','dash.directives'])

.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/login");	

	$stateProvider
		.state('login',{
			url: '/login',
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
		})
		.state('settings',{
			url: '/settings',
			templateUrl: 'partials/settings.html',
			controller: 'settingsCtrl'
		})
		.state('dash',{
			url: '/dash',
			templateUrl: 'partials/dash.html',
			controller: 'weatherCtrl'
		});
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

