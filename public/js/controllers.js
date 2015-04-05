'use strict';

angular.module('dash.controllers',[])

.controller('weatherCtrl', ['$scope', 'openWeatherMap', 'getLocationSetting',  function($scope, openWeatherMap, getLocationSetting){

	// if (navigator.geolocation) {
 //        navigator.geolocation.getCurrentPosition(function(position){
 //        	console.log(position);
 //        });
 //    } else {
 //        console.log("Geolocation is not supported by this browser.");
 //    }
 	

 	
 	// console.log(getLocationSetting());
 	$scope.loc = getLocationSetting();

	console.log($scope.loc);

	$scope.iconBaseUrl = 'http://openweathermap.org/img/w/';

	$scope.$watch(function(scope){
		return scope.loc;
	}, function(newval, oldval){
		$scope.weather = openWeatherMap.queryWeather({
			location: newval
		});

		$scope.forecast = openWeatherMap.queryForecastDaily({
			location: newval
		});
	});

	$scope.weather = openWeatherMap.queryWeather({
			location: $scope.loc
	});

	$scope.forecast = openWeatherMap.queryForecastDaily({
			location: $scope.loc
	});

	// console.log($scope.weather);
	console.log($scope.forecast);

	$scope.getIconImageUrl = function(iconName) {
      return (iconName ? $scope.iconBaseUrl + iconName + '.png' : '');
    };
    $scope.parseDate = function (time) {
          return new Date(time * 1000);
    };
}])

.controller('loginCtrl', ['$scope', function($scope){

}])

.controller('settingsCtrl', ['$scope', 'setLocation', 'checkLocation', 'getLocationSetting', function($scope, setLocation, checkLocation, getLocationSetting){

	if(checkLocation()){
		$scope.message = "Location currently set is " + getLocationSetting();
	}

	$scope.setLocation = function(){
 		setLocation($scope.location);
 		$scope.success="Your settings saved successfully";
 	}
}])