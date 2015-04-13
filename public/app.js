'use strict';

angular.module('dash',['ui.router','dash.controllers','dash.services','dash.directives', 'ui.calendar','ui.bootstrap', 'Dropbox'])

.config(function($stateProvider, $urlRouterProvider, DropboxProvider){
	$urlRouterProvider.otherwise("/dash");	

	$stateProvider
		.state('app',{
			abstract: true,
			views:{
				'':{
					templateUrl: 'partials/layout.html'
				},
				'header@app': {
					templateUrl: 'partials/header.html'
				},
				'sidebar@app': {
					templateUrl: 'partials/sidebar.html'
				}
			}
		})
		.state('dash',{
			url: '/dash',
			parent: 'app', 
			views: {
				'': {
					templateUrl: 'partials/dash-layout.html'
				},
				'content@dash': {
					templateUrl: 'partials/dash.html',
					controller: 'dashCtrl'
				}
			}
		})
		.state('settings',{
			url:'/settings',
			parent: 'app',
			views: {
				'': {
					templateUrl: 'partials/settings-layout.html'
				},
				'content@settings': {
					templateUrl: 'partials/settings.html',
					controller: 'settingsCtrl'
				}
			}
		})
		.state('login',{
			url:'/login',
			parent: 'app',
			views: {
				'': {
					templateUrl: 'partials/login-layout.html'
				},
				'header@app':{

				},
				'sidebar@app': {

				},
				'content@login': {
					templateUrl: 'partials/login.html',
					controller: 'loginCtrl'
				}
			}
		});

	DropboxProvider.config('vb60si76xhcnr42', 'http://localhost:3000/oauth_receiver.html');	
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

