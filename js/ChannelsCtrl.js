angular.module('youcodeio.controllers.channels', [])

	.controller('ChannelsCtrl', function ($q, $scope, googleService) {
	$scope.channels = [];
	$scope.query = "";

	$scope.initiate = function(){

		var banners = [];
		var savePromises = [];
		$scope.unicorn = true;
		requests = youtube_talks;
		requests = requests.concat(youtube_tuts);

		requests.sort(function(a, b){
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		})

		angular.forEach(requests, function(value, key){
			banners[key] = googleService.searchLastTwovideos(1, value.id, value.name)
		});
		$q.all(banners).then(function(d){
			angular.forEach(requests, function(value,key) {
				savePromises[key] = googleService.searchLastTwovideos(2,value.id,value.name);
			});
			$q.all(savePromises).then(function(data){
				$scope.parsingResults(data, d);
			});
		});
	}

	$scope.parsingResults = function (data, d){
		$scope.channels = [];

		var videos = [];

		angular.forEach(data, function(value,key) {
			$scope.channels[key] = {
					channel_name:d[key].items[0].snippet.title,
					channel_logo: d[key].items[0].snippet.thumbnails.high,
					channel_banner: d[key].items[0].brandingSettings.image.bannerImageUrl,
					channel_video: []
				};
			angular.forEach(value.items, function(result,key2){
			$scope.channels[key].channel_video.push(result.snippet);
			});
		});
		$scope.unicorn = false;
        console.log($scope.channels);
	};
})



