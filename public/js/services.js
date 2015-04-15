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

.factory('getLocationSetting', ['initFirebase', 'Auth', '$q', function(initFirebase, Auth, $q){
	return function(){
    var defer = $q.defer();
    var ref = initFirebase;
    var authData = Auth.$getAuth();
    var uid = authData.uid;
    ref.child('users').child(uid).on('value', function(snapshot){
      console.log(snapshot.val().location);
      return defer.resolve(snapshot.val().location);
      // return snapshot.val().location;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        return defer.reject(errorObject);
    });
    return defer.promise;
		// if(localStorage.getItem('location')){
		// 	console.log(localStorage.getItem('location'));
		// 	return localStorage.getItem('location')
		// }
		// return 'Chennai';
	};
}])

.factory('setLocation', ['initFirebase', 'Auth', function(initFirebase, Auth ){
	return function(location){
		if(location){
      var ref = initFirebase;
      var authData = Auth.$getAuth();
      var uid = authData.uid;
      ref.child('users').child(uid).update({'location': location}, function(error){
        if(error){
          console.log('Error updating firebase ' + error);
        }
        console.log('Location successfully updated in fire base');
        // localStorage.setItem('location', location);
        // console.log('Location set in local storage');
      });

      // ref.child('users').child.(uid).on('value', function(snapshot){
      //   console.log(snapshot.val();)
      // })
			
		}
	};
}])

.factory('checkLocation', [function(){
	return function(){
		var location = localStorage.getItem('location');
		if(location){
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
      $window.sessionStorage['authData'] = JSON.stringify(authData);
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
