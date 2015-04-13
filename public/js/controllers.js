'use strict';

angular.module('dash.controllers',[])

.controller('weatherCtrl', ['$scope', 'openWeatherMap', 'getLocationSetting', function($scope, openWeatherMap, getLocationSetting){
    
    $scope.currentTime = moment().format('h:mm a');
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

    console.log($scope.weather);
    console.log($scope.forecast);

    $scope.getIconImageUrl = function(iconName) {
      return (iconName ? $scope.iconBaseUrl + iconName + '.png' : '');
    };
    $scope.parseDate = function (time) {
          return new Date(time * 1000);
    };
    $scope.parseDay = function(time){
        var date = moment(time * 1000);
        return date.format('ddd');
    }

}])

.controller('calendarCtrl', ['$scope', function($scope){
    
    var CLIENT_ID = '707496747102-5kn3srn6rsnpepr66mi0ng49v21vus5i.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

    $scope.visible = true;
    $scope.eventSources = [];

    $scope.authenticate = function(){
        gapi.auth.authorize({
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': false
        }, handleAuthResult)
    }

   
    
    function handleAuthResult(authResult){
        if(authResult && !authResult.error){
            $scope.visible = false;
            console.log('Application authroized');
            loadCalendarApi();
        }
        else{
            console.log('Application not yet authorized');
            $scope.visible = true;
        }
    }

    function loadCalendarApi(){
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
    }

    function listUpcomingEvents(){
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 20,
            'orderBy': 'startTime'
        });

        request.execute(function (res){
            console.log(res.items);
            fullCal(res.items);
        });


    }

    function fullCal(entries){
        // var eventsList = [];
        entries.forEach(function(entry){
            $scope.events.push({
                id: entry.id,
                title: entry.summary,
                start: entry.start.dateTime || entry.start.date, 
                end: entry.end.dateTime || entry.end.date,
                url: entry.htmlLink,
                location: entry.location,
                description: entry.description
            })
        })
        console.log($scope.events);
        $scope.eventSources = [$scope.events];
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.events = [
      // {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false}
      // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];

    $scope.eventSources = [$scope.events];
}])

.controller('sliderCtrl', ['$scope', 'Dropbox', function($scope, Dropbox){
    

    // Slider

    $scope.myInterval = 2000;
    $scope.slides = [];

    //Dropbox

    Dropbox.init().then(function(){
        // Auhentication succesfull
    }, function(error){
        showError(error);
    });

    Dropbox.readdir('/Test').then(function(response){
        var entries, stat, entries_stat;
        entries = response[0];
        stat = response[1];
        entries_stat = response[2];
        // console.log(entries);
        readFiles(entries, stat, entries_stat);
    }, function(error){
        console.log(error);
        showError(error);
    });

    var readFiles = function(entries, stat, entries_stat){
        for (var i = 0; i < entries_stat.length; i++) {
            var filePath = entries_stat[i].path;
            Dropbox.readFile(filePath, {arrayBuffer: true}).then(function(data, stat, rangeinfo){
                prepareBlobs(data);
            }, function(error){
                console.log(error);
                showError(error);
            })
        };
    };

    var prepareBlobs = function(data){
        blobUtil.arrayBufferToBlob(data,"image/jpeg").then(function(blob){
            var imageUrl = blobUtil.createObjectURL(blob);
            $scope.slides.push({image: imageUrl});
            console.log($scope.slides)
        }, function(error){
            console.log(error);
        });
    }

    var showError = function(error) {
        switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            // If you're using dropbox.js, the only cause behind this error is that
            // the user token expired.
            // Get the user through the authentication flow again.
            console.log("If you're using dropbox.js, the only cause behind this error is that the user token expired. Get the user through the authentication flow again.")
            break;

        case Dropbox.ApiError.NOT_FOUND:
            // The file or folder you tried to access is not in the user's Dropbox.
            // Handling this error is specific to your application.
            console.log('The file or folder you tried to access is not in the user\'s Dropbox');
            break;

        case Dropbox.ApiError.OVER_QUOTA:
            // The user is over their Dropbox quota.
            // Tell them their Dropbox is full. Refreshing the page won't help.
            console.log('User is over their Dropbox quota');
            break;

        case Dropbox.ApiError.RATE_LIMITED:
            // Too many API requests. Tell the user to try again later.
            // Long-term, optimize your code to use fewer API calls.
            console.log('Too many API requests');
            break;

        case Dropbox.ApiError.NETWORK_ERROR:
            // An error occurred at the XMLHttpRequest layer.
            // Most likely, the user's network connection is down.
            // API calls will not succeed until the user gets back online.
            console.log('May be your internet is down');
            break;

        case Dropbox.ApiError.INVALID_PARAM:
            console.log('You have passed some invalid parameters');
            break;
        case Dropbox.ApiError.OAUTH_ERROR:
            console.log('Authorization error');
            break;
        case Dropbox.ApiError.INVALID_METHOD:
            console.log('There is no such method');
            break;
        default:
            // Caused by a bug in dropbox.js, in your application, or in Dropbox.
            // Tell the user an error occurred, ask them to refresh the page.
        }
      };

    

    
}])

.controller('dashCtrl', ['$scope', function($scope){

	// if (navigator.geolocation) {
 //        navigator.geolocation.getCurrentPosition(function(position){
 //        	console.log(position);
 //        });
 //    } else {
 //        console.log("Geolocation is not supported by this browser.");
 //    }
 	
}])

.controller('loginCtrl', ['$scope', function($scope){

}])

.controller('settingsCtrl', ['$scope', 'setLocation', 'checkLocation', 'getLocationSetting', function($scope, setLocation, checkLocation, getLocationSetting){

	if(checkLocation()){
		$scope.message = "Location currently set is " + getLocationSetting();
	}

	$scope.setLocation = function(){
 		setLocation($scope.location || 'Chennai');
 		$scope.success="Your settings saved successfully";
 	}
}])

.controller('headerCtrl', ['$scope', function($scope){
    
}])