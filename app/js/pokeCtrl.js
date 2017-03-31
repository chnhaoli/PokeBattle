// Poke controller that we use whenever we have view that needs to
// display or modify the Poke menu
pokeBattleApp.controller('PokeCtrl', function ($scope,PokeModel) {

    // Pokemon
    $scope.clearOffset = function() {
      console.log("clicked clear");
      PokeModel.clearOffset();
    }


    //Test for checking name;
    $scope.startIO = 1;
    $scope.checkName = function(){

    	for(i in $scope.userNameList ){
    		if($scope.user_name === $scope.userNameList[i]){
    		console.log("This name is taken, please try another one.");
    		$scope.startIO = 0;
    		}

    		if($scope.startIO === 1){
    			window.location.href = "http://localhost:8000/index.html#!/choose";
    		}
    	}    	
    	$scope.startIO = 1;
    }

    $scope.userNameList = ["John", "Mary", "Phillip"];
});
