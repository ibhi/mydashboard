'use strict';

angular.module('dash',['ui.router','dash.controllers','dash.services','dash.directives', 'ui.calendar','ui.bootstrap', 'Dropbox','firebase', 'images-resizer'])

.config(function($stateProvider, $urlRouterProvider, DropboxProvider){
	$urlRouterProvider.otherwise('/login');	

	$stateProvider
		.state('app',{
			abstract: true,
			views:{
				'':{
					templateUrl: 'partials/layout.html'
				},
				'header@app': {
					templateUrl: 'partials/header.html',
					controller: 'headerCtrl'
				},
				'sidebar@app': {
					templateUrl: 'partials/sidebar.html'
				}
			},
			data: {
				requireLogin: true
			}
		})
		.state('dash',{
			url: '/dash',
			parent: 'app',
			controller: 'dashCtrl',
			views: {
				'': {
					templateUrl: 'partials/dash-layout.html'
				},
				'content@dash': {
					templateUrl: 'partials/dash.html',
					controller: 'dashCtrl'
				},
				'weather@dash':{
					templateUrl: 'partials/weather-widget.html',
					controller: 'weatherCtrl'
				},
				'calendar@dash':{
					templateUrl: 'partials/calendar-widget.html',
					controller: 'calendarCtrl'
				},
				'slider@dash':{
					templateUrl: 'partials/slider-widget.html',
					controller: 'sliderCtrl'
				}
			},
			resolve: {  
					"currentAuth": ["Auth", function(Auth) {			        	
						return Auth.$requireAuth();
			      }]
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
			},
			resolve: {
			      // controller will not be loaded until $waitForAuth resolves
			      // Auth refers to our $firebaseAuth wrapper in the example above
			      "currentAuth": ["Auth", function(Auth) {
			        // $waitForAuth returns a promise so the resolve waits for it to complete
			        return Auth.$requireAuth();
			      }]
			}
		})
		.state('login',{
			url:'/login',
			parent: 'app',
			views: {
				'@app': {
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
			},
			data: {
				requireLogin: false
			}
		});

	DropboxProvider.config('vb60si76xhcnr42', 'http://localhost:3000/oauth_receiver.html');	
})

.run(function($rootScope, $state){
	
	// $rootScope.$on('$stateChangeStart', 
	// 	function(event, toState, toParams, fromState, fromParams){
	// 		var requireLogin = toState.data.requireLogin;
	// 		if(requireLogin && typeof $rootScope.currentUser === 'undefined'){
	// 			event.preventDefault();
	// 			$state.go('login');
	// 		}
	// })

	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
	  // We can catch the error thrown when the $requireAuth promise is rejected
	  // and redirect the user back to the home page
	  if (error === "AUTH_REQUIRED") {
	  	console.log('Probaly auth error, redirecting to login page');
	    $state.go("login");
	  }
	});
});

