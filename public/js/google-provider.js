angular.module('GCal',[])

.provider('GCal', [function(){
	var clientId, scopes, apiKey;

	this.config = function(id, key, sco){
		this.clientId = clientId = id;
		this.apiKey = apiKey = key;
		this.scopes = scopes = sco;
	};
	this.$get = ['$q', '$timeout', function($q, $timeout){
		return{
			checkAuth: function(){
				var result;
				gapi.client.setApiKey(apiKey);
				$timeout(function(){
					gapi.auth.authorize({
						clientId: clientId,
						scope: scopes,
						immediate: true
					}, function(authResult){
						if(authResult && !authResult.error){
							result = true;
						}else{
							result = false;
						}
					})
					return result;
				}, 500)
			},
			auth: function(){
				var defer = $q.defer();
				gapi.auth.authorize({
					clientId: clientId,
					scope: scopes,
					immediate: false
				}, function(authResult){
					if(authResult && !authResult.error){
						defer.resolve(authResult);
					}else{
						defer.reject(authResult.error);
					}
				})
				return defer.promise;
			},
			// Todo: return promise instead of results
			// Todo: Load results from multiple Calendar id
			listUpcomingEvents: function(){
				var results;
				gapi.client.load('calendar', 'v3', function(){
					var request = gapi.client.calendar.events.list({
			          'calendarId': 'primary',
			          'timeMin': (new Date()).toISOString(),
			          'showDeleted': false,
			          'singleEvents': true,
			          'maxResults': 10,
			          'orderBy': 'startTime'
			        });
			        request.execute(function (res){
            			results = res.items;
        			});
				});
				return results;
			}

		};
	}]
}])