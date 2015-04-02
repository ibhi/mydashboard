angular.module('dash.directives',[])

.directive('weatherPanel', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		templateUrl: 'partials/weather-panel.html',
		scope: {
			forecast:'=',
			forecastDay:'='
		},

		link: function(scope, el, attr){
			scope.getIconImageUrl = function(iconName) {
		      return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
		    };
		    scope.parseDate = function (time) {
		          return new Date(time * 1000);
		    };
			
		}
	};
}]);