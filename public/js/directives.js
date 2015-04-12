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

		link: function(scope, element, attrs){
			scope.getIconImageUrl = function(iconName) {
		      return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
		    };
		    scope.parseDate = function (time) {
		          return new Date(time * 1000);
		    };
			
		}
	};
}])

.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                // element.toggleClass(attrs.toggleClass);
                console.log('Toggle button clicked');
                element.parents('body').toggleClass(attrs.toggleClass)
            });
        }
    };
});