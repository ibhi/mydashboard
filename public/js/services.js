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

.service('dropboxClient', function($q){
  

  

  // var _client;

  var getDropboxClient = function(){
    // return _client;
    return JSON.parse(localStorage.getItem('dropboxClient'));
  };

  var setDropboxClient = function(client){
    // _client = client;
    localStorage.setItem('dropboxClient', JSON.stringify(client));
    console.log('Client successfully set in local storage');
  }

    // client.authDriver(new Dropbox.AuthDriver.Cordova());
  

  var authenticate = function(client){
    var q = $q.defer();
  client.authenticate({interactive: false},function(error, client) {
      if (error) {
        q.reject(error);
      }
      if(client.isAuthenticated()){
        q.resolve(client);        
      }
      else{
        client.authenticate(function(error, client){
          if(error){
            q.reject(error)
          }
          q.resolve(client);
        })     
      }

    });

    return q.promise;
  };
  
  var getAccountInfo = function(){
    var q = $q.defer();
    client.getAccountInfo(function(error, accountInfo) {
        if (error) {
            q.reject(error);
        }
    q.resolve(accountInfo);         
    });
    return q.promise;
  };

  var readdir = function(client, path, options){
    var q= $q.defer();
    client.readdir(path, options, function(error, entries, stat, entries_stat){
      if(error){
        q.reject(error);
      }
      q.resolve([entries, stat, entries_stat]);
    })
    return q.promise;
  };

  var readFile = function(client, path,options){
    var q = $q.defer();
    client.readFile(path,options, function(error, data, stat, rangeinfo){
      if(error){
        q.reject(error);
      }
      q.resolve([data, stat, rangeinfo]);
    })
    return q.promise;
  }

    return {
      getDropboxClient: getDropboxClient,
      setDropboxClient: setDropboxClient,
      authenticate: authenticate,
      getAccountInfo: getAccountInfo,
      readdir: readdir,
      readFile: readFile
    };
})