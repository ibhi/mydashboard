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

.factory('getLocationSetting', [function(){
	return function(){
		if(localStorage.getItem('location')){
			console.log(localStorage.getItem('location'));
			return localStorage.getItem('location')
		}
		return null;
	};
}])

.factory('setLocation', [function(){
	return function(location){
		if(location){
			localStorage.setItem('location', location);
			console.log('Location set in local storage');
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