angular.module('youcodeio.controllers.channels', [])

	.controller('ChannelsCtrl', function ($q, $scope, googleService) {
	$scope.channels = [];
	$scope.query = "";
	var alarmUrl = "http://s.ytimg.com/yts/img/channels/c4/default_banner-vfl7DRgTn.png";

		console.log("initiate");

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
				$scope.show_channel = $scope.channels[0];
			});
		});
	

	$scope.parsingResults = function (data, d){
		$scope.channels = [];

		var videos = [];

		angular.forEach(data, function(value,key) {
			if(alarmUrl===d[key].items[0].brandingSettings.image.bannerImageUrl){
				d[key].items[0].brandingSettings.image.bannerImageUrl = "img/default_banner.png";
			}
			$scope.channels[key] = {
					channel_name:d[key].items[0].snippet.title,
					channel_logo: d[key].items[0].snippet.thumbnails.high,
					channel_banner: d[key].items[0].brandingSettings.image.bannerImageUrl,
					channel_link: "https://www.youtube.com/channel/"+d[key].items[0].id,
					channel_video: []
				};
			angular.forEach(value.items, function(result,key2){
				var video = {
					video_title: result.snippet.title,
					video_desc: result.snippet.description,
					video_publishedAt: new Date(result.snippet.publishedAt),
					video_thumbnails: result.snippet.thumbnails,
					video_link: "https://www.youtube.com/watch?v="+result.id.videoId
				};
				$scope.channels[key].channel_video.push(video);
			});
		});
		$scope.unicorn = false;
	};

	$scope.changePrimary = function(channelObject){
		$scope.show_channel = channelObject;
	};

	$scope.formatDate = function (date){
		return 	moment(date.getTime(), "x").fromNow();
	};
});

