'use strict';

angular.module('dash.services',['ngResource'])

.factory('openWeatherMap',['$resource',function($resource) {

    // API key is currently unused (work either with or without key)
    var apiKey = '279b4be6d54c8bf6ea9b12275a567156';
    var apiBaseUrl = 'http://api.openweathermap.org/data/2.5/';

    return $resource(apiBaseUrl + ':path/:subPath?q=:location',
      {
//        APPID: apiKey,
        mode: 'jsonp',
        callback: 'JSON_CALLBACK',
        units: 'metric',
        lang: 'en'
      },
      {
        queryWeather: {
          method: 'JSONP',
          params: {
            path: 'weather'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecast: {
          method: 'JSONP',
          params: {
            path: 'forecast'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecastDaily: {
          method: 'JSONP',
          params: {
            path: 'forecast',
            subPath: 'daily',
            cnt: 7
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        }
      }
    )
}])

.factory('Location', ['initFirebase', 'Auth', '$q', '$rootScope', '$firebaseObject',function(initFirebase, Auth, $q, $rootScope, $firebaseObject){
    var ref = initFirebase.child('users');
    var authData = Auth.$getAuth();
    var uid = authData.uid;
    return $firebaseObject(ref.child(uid).child('location'));
}])

.factory('checkLocation', ['Location', function(Location){
	return function(){
		var location = Location;
		if(location.$value !== null || location.$value !== ""){
      console.log()
			return true;
		}
		return false;
	};
}])

.factory('initFirebase', [function(){
  
    var ref = new Firebase('https://ibhi-mydashboard.firebaseio.com/');
    return ref;
  

}])

.factory('Auth', ['$firebaseAuth', 'initFirebase', function($firebaseAuth, initFirebase){
  
    return $firebaseAuth(initFirebase);
  
}])

.factory('authService', ['$q', '$window', 'Auth', function($q, $window, Auth){
  function login(user){
    var defer = $q.defer();
    
    Auth.$authWithPassword(user).then(function(authData){
      // $window.sessionStorage['authData'] = JSON.stringify(authData);
      defer.resolve(authData);
    }).catch(function(error){
      defer.reject(error);
    });
    return defer.promise;
  }

  return{
    login: login
  }
}])
