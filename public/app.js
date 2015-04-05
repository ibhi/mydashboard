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
		.state('dash',{
			url: '/dash',
			templateUrl: 'partials/dash.html',
			controller: 'weatherCtrl'
		});
});