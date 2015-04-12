angular.module('Dropbox',[])

.provider('Dropbox', [function(){

	var clientId, redirectUri;

	// config function for setting up client id and redirect uri (To get client id, login to dropbox app console and create an application)
	this.config = function(id, uri){
		this.clientId = clientId = id;
		this.redirectUri = redirectUri = uri;
	}

	this.$get = ['$q', function($q){

		// Setup client instance from Dropbox class defined in dropbox.js

		var client = new Dropbox.Client({ key: clientId});

		client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: redirectUri}));

		return {
			// Authenticates the client, if the cached credentials are available authenticates automatically
			// returns a promise
			init: function(){

				var deferred;
				// $q deferred promise object
				deferred = $q.defer();

				client.authenticate({interactive: false}, function(error, client){
				    if (error) {
				        console.log('Authentication Error');
				        deferred.reject(error);
				    }
				    // Check if cached credentials are available
				    if (client.isAuthenticated()) {
				        console.log('Client is already authenticated' );
				        deferred.resolve();
				    } else {
				        // Show the popup window for the user to authorize the application
				        client.authenticate(function(error, client) {
				            if (error) {
				              console.log('Authentication Error');
				              deferred.reject(error);
				            }
				            console.log('Authentication successful');
				            deferred.resolve();
				        });
				    }
				});

				return deferred.promise;
			},

			// Authenticates the client
			// Returns promise
			authenticate: function(){
				var deferred;
				// $q deferred promise object
				deferred = $q.defer();
				client.authenticate(function(error, client) {
		            if (error) {
		              console.log('Authentication Error');
		              deferred.reject(error);
		            }
		            console.log('Authentication successful');
		            deferred.resolve();
		        });
		        return deferred.promise;
			},

			// Check if the client is already authenticated
			// Returns boolean
			isAuthenticated: function(){
				return client.isAuthenticated() ? true : false;
			},

			// Read a directory as specified in path and returns its entries, stat and entries_stat
			// Returns promise
			readdir: function(path){

				var deferred;
				// $q deferred promise object
				deferred = $q.defer();

				client.readdir(path, function(error, entries, stat, entries_stat){
					if(error){
						console.log('Error reading directory at ' + path);
						deferred.reject(error);
					}
					deferred.resolve([entries, stat, entries_stat]);
				});

				return deferred.promise;
			},

			// Reads a file as specified in the path and returns the file contents
			// Returns a promise
			readFile: function(path, options){

				var deferred;
				// $q deferred promise object
				deferred = $q.defer();

				client.readFile(path, options, function(error, data, stat, rangeinfo){
					if(error){
						console.log('Error readinf file at ' + path);
						deferred.reject(error);
					}
					deferred.resolve(data, stat, rangeinfo);
				});

				return deferred.promise;
			}

		} //return

	}]
}])