angular.module('app.controllers', [])

.controller('homeCtrl',function($scope,$ionicPlatform, $q) {
	var token = null;	
	console.log('homeCtrl');
	
	$scope.items = [{ text : "first item" }];
	
	var onMessage = function(data) {
		console.log( 'onMessage:'+JSON.stringify(data) );
        var item = { text: JSON.stringify(data) };
        $scope.items.push(item);
        $scope.$apply();
	};
	
	var onTokenRefresh = function(t) {
		console.log( 'onTokenRefresh:'+t);
		token = t;
	};
	
	var getToken = function() {
		var d = $q.defer();
		
		FCMPlugin.getToken(function(t){
			console.log( 'getToken:'+t);
			token=t;
            d.resolve(t);
        },function(err) {
        		d.reject(err);
        });
		
		return d.promise;
	};
	
	
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && FCMPlugin) {
			FCMPlugin.onTokenRefresh(onTokenRefresh);

			getToken().then(function(t) {
				FCMPlugin.subscribeToTopic('world', function(msg) {
		          console.log('subscribed');
		          console.log(msg);
		        }, function(err) {
		          console.error(err);
		        });
				FCMPlugin.onNotification(onMessage);
			});
			
		}
	});
})
;