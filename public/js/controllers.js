'use strict';

angular.module('dash.controllers',[])

.controller('weatherCtrl', ['$scope', 'openWeatherMap', 'getLocationSetting', function($scope, openWeatherMap, getLocationSetting){

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

    // Calendar

    $scope.eventSources = [];

    //Dropbox

    $scope.imgSrc = [];

    var client = new Dropbox.Client({ key: "vb60si76xhcnr42" });

    client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "http://localhost:3000/oauth_receiver.html"}));

    client.authenticate({interactive: false}, function(error, client){
        if (error) {
            console.log('Authentication Error')
        }
        if (client.isAuthenticated()) {
            // Cached credentials are available, make Dropbox API calls.
            console.log('client is already authenticated' );
            imgSrc(client, '/Test')
        } else {
            // show and set up the "Sign into Dropbox" button
            client.authenticate(function(error, client) {
                if (error) {
                  console.log('Authentication Error');
                }
                console.log('Authentication successful');
                imgSrc(client, '/Test')
            });
        }
    });

    function imgSrc(client, path){
        client.readdir(path, function(error, entries, stat, entries_stat){
            if(error){
                console.log('Error reading directory ' + path);
                return;
            }
            // console.log(entries, stat, entries_stat);
            for (var i = entries_stat.length - 1; i >= 0; i--) {
                console.log('Path: ' + entries_stat[i].path);
                client.readFile(entries_stat[i].path, {arrayBuffer: true}, function(error, data, stat, rangeinfo){
                    blobUtil.arrayBufferToBlob(data,"image/jpeg").then(
                      function(blob){
                          var imageUrl = blobUtil.createObjectURL(blob);
                          $scope.imgSrc.push(imageUrl) ;
                          console.log($scope.imgSrc)
                      },function(error){
                          console.log(error);
                      }
                     );
                })
            };

        })
    }


    // Slider

    $scope.myInterval = 1000;

    // Dropbox.authenticate().then(
    //     function(result){
    //         console.log(result);
    //         // Dropbox.accountInfo().then(
    //         //     function(result){
    //         //         console.log(result);
    //         //     }, function(error){
    //         //         console.log(error);
    //         //     }
    //         // )

    //     }, function(error){
    //         console.log(error);
    //     }
    // )
    // Dropbox.accountInfo().then(
    //     function(result){
    //         console.log(result);
    //     }, function(error){
    //         console.log(error);
    //     }
    // )
    // console.log(Dropbox.accountInfo());

    // var client = new Dropbox.Client({ key: "vb60si76xhcnr42" });

    // var client = new Dropbox.Client({ key: "vb60si76xhcnr42" });

    // client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "http://localhost:3000/oauth_receiver.html"}));

    // $scope.authenticate = function(){
    // 	dropboxClient.authenticate(client).then(
    // 		function(client){
    // 	    	dropboxClient.setDropboxClient(client);
    // 	    	// console.log(dropboxClient.getDropboxClient());
    // 	    	// dropboxClient.readdir('/Test').then(
    // 	    	// 	function(entries, stat, entries_stat){
    // 	    	// 		console.log(entries[0],entries[1],entries[2] );
    // 	    	// 	},function(error){
    // 	    	// 		console.log(error);
    // 	    	// 	}
    // 	    	// );
    // 	    	// dropboxClient.readFile('/Test/IMG004.jpg', { arrayBuffer: true}).then(
    // 	    	// 	function(data, stat,rangeinfo){
	   //  			  //   console.log(data[0]);
	   //  			  //   blobUtil.arrayBufferToBlob(data[0],"image/jpeg").then(
	   //  			  //   	function(blob){
	   //  			  //   		var imageUrl = blobUtil.createObjectURL(blob);
	   //  			  //   		$scope.imgSrc = imageUrl;
    //       //                       console.log($scope.imgSrc)
	   //  			  //   		console.log("Success" + imageUrl)
	   //  			  //   	},function(error){
	   //  			  //   		console.log(error);
	   //  			  //   	}
	   //  			  //   );
	    			    

	    			    

    // 	    	// 	},function(error){
    // 	    	// 		console.log(error);
    // 	    	// 	}
    // 	    	// );
    // 	  	}, function(error){
    // 	    	console.log(error);
    // 	  	}
    // 	);
    // }

    // client = dropboxClient.getDropboxClient();
    // console.log(client);
    // dropboxClient.readdir(client, '/Test').then(
    //     function(entries, stat, entries_stat){
    //         var entries = result[0],
    //         stat = result[1],
    //         entries_stat=result[2];

    //         console.log(entries, stat, entries_stat );
    //     },function(error){
    //         console.log(error);
    //     }
    // );

    

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