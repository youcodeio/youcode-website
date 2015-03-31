angular.module('youcodeio.controllers.welcome', []).controller('WelcomeCtrl', function ($q,$scope,googleService) {

	$scope.channels = [];
	$scope.isTuts = false;
	$scope.showAbout = true;
	$scope.query = "";
	$scope.last_query = "";
	$scope.isNull = false;
    $scope.show = false;

	$scope.search = function (){

		if ($scope.query == '') {
			$scope.showAbout = true;
			return;
		}
		$scope.isNull = false;
		var savePromises = [];
		$scope.unicorn = true;
		$scope.showAbout =  false;
		
		if ($scope.isTuts) {
			var requests = youtube_tuts;
		} else{
			var requests = youtube_talks;
		};

		angular.forEach(requests, function(value,key) {
			savePromises[key] = googleService.searchVideo($scope.query,value.id);

		});
		$q.all(savePromises).then(function(data){
			$scope.parsingResults(data);
		});
	}

	$scope.parsingResults = function (data){
		var videos = [];
		$scope.channels = [];

		angular.forEach(data, function(value,key) {
			angular.forEach(value.items, function(result) {
				result.snippet.publishedAt = new Date(result.snippet.publishedAt);
				result.snippet.id = result.id.videoId;
				videos.push(result.snippet);
			});
		});
		$scope.channels = videos;
		$scope.channels.sort(function(a, b) {
			a = a.publishedAt;
			b = b.publishedAt;
			return a>b ? -1 : a<b ? 1 : 0;
		});

		if ($scope.channels.length == 0) {
			$scope.last_query = $scope.query;
			$scope.isNull = true;
		}

		$scope.unicorn = false;
	};

	$scope.formatDate = function (date){
		return 	moment(date.getTime(), "x").fromNow();
	};

	$scope.startSearch = function (name) {

		$( "#poney" ).addClass( "active" );
		$( "#amazing_poney" ).addClass( "active" );
		$scope.query = name;
		$scope.search();
	}
	$scope.changeToggle = function () {
		$scope.isTuts = !$scope.isTuts;
		$scope.search();
	}

});