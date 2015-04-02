angular.module('youcodeio.controllers.header', []).controller('HeaderCtrl', function ($q,$scope,googleService,$state) {

	$scope.isTuts = false;
	$scope.query = "";

		if(typeof($state.params.query)!='undefined'){
			if(typeof($state.params.isTuts)!='undefined'){
				if ($state.params.isTuts === 'false') {
					$scope.isTuts = false;
				} else{
					$scope.isTuts = true;
				}
    				$scope.query = decodeURI($state.params.query);
    			}
    		}
    	$scope.startSearch = function () {

    		return "#/search?query="+$scope.query+"&isTuts="+$scope.isTuts;
    	}

    	$scope.startPopular = function (name) {
    		$scope.query = name;
    		$scope.startSearch();
    	}

    	$scope.toggleTuts = function () {
    		
    		window.location.assign($scope.startSearch());
    	} 	

});