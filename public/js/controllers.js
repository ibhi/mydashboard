'use strict';

angular.module('dash.controllers',[])

.controller('weatherCtrl', ['$scope', 'openWeatherMap', 'getLocationSetting', 'Dropbox', function($scope, openWeatherMap, getLocationSetting, Dropbox){

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

    // fullCalendar

    $scope.eventSources = [];

    //Dropbox

    $scope.slides = [];

    Dropbox.init();

    Dropbox.readdir('/Test').then(function(response){
        var entries, stat, entries_stat;
        entries = response[0];
        stat = response[1];
        entries_stat = response[2];
        console.log(entries);
        readFiles(entries, stat, entries_stat);
    }, function(error){
        console.log(error);
    });

    var readFiles = function(entries, stat, entries_stat){
        for (var i = 0; i < entries_stat.length; i++) {
            var filePath = entries_stat[i].path;
            Dropbox.readFile(filePath, {arrayBuffer: true}).then(function(data, stat, rangeinfo){
                prepareBlobs(data);
            }, function(error){
                console.log(error);
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

    // var client = new Dropbox.Client({ key: "vb60si76xhcnr42" });

    // client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "http://localhost:3000/oauth_receiver.html"}));

    // client.authenticate({interactive: false}, function(error, client){
    //     if (error) {
    //         console.log('Authentication Error')
    //     }
    //     if (client.isAuthenticated()) {
    //         // Cached credentials are available, make Dropbox API calls.
    //         console.log('client is already authenticated' );
    //         imgSrc(client, '/Test')
    //     } else {
    //         // show and set up the "Sign into Dropbox" button
    //         client.authenticate(function(error, client) {
    //             if (error) {
    //               console.log('Authentication Error');
    //             }
    //             console.log('Authentication successful');
    //             imgSrc(client, '/Test')
    //         });
    //     }
    // });

    // function imgSrc(client, path){
    //     client.readdir(path, function(error, entries, stat, entries_stat){
    //         if(error){
    //             console.log('Error reading directory ' + path);
    //             return;
    //         }
    //         // console.log(entries_stat);

    //         // console.log(entries, stat, entries_stat);
    //         for (var i = entries_stat.length - 1; i >= 0; i--) {
    //             console.log('Path: ' + entries_stat[i].path);
    //             client.readFile(entries_stat[i].path, {arrayBuffer: true}, function(error, data, stat, rangeinfo){
    //                 // console.log(stat);
    //                 blobUtil.arrayBufferToBlob(data,"image/jpeg").then(
    //                   function(blob){
    //                       var imageUrl = blobUtil.createObjectURL(blob);
    //                       var testImage = new Image();
    //                       testImage.src=imageUrl;
    //                       console.log(testImage.height);
    //                       $scope.slides.push({image: imageUrl});
    //                       console.log($scope.slides)
    //                   },function(error){
    //                       console.log(error);
    //                   }
    //                  );
    //             })
    //         };

    //     })
    // }


    // Slider

    $scope.myInterval = 2000;
    

    

    var CLIENT_ID = '707496747102-5kn3srn6rsnpepr66mi0ng49v21vus5i.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

    $scope.visible = true;

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