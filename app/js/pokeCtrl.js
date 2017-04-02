// Poke controller that we use whenever we have view that needs to
// display or modify the Poke menu
pokeBattleApp.controller('PokeCtrl', function ($scope, $firebaseObject, PokeModel) {

  // Firebase
  var accountsRef = firebase.database().ref('/accounts/');
  var accountsObj = $firebaseObject(accountsRef);

  // to take an action after the data loads, use the $loaded() promise
  accountsObj.$loaded().then(function() {
    console.log("loaded record:", accountsObj.$id, accountsObj.$value);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(accountsObj, function(value, key) {
      //console.log(key, value);
    });
  });

  // To make the data available in the DOM, assign it to $scope
  $scope.accountsObj = accountsObj;

  // For three-way data bindings, bind it to the scope instead
  accountsObj.$bindTo($scope, "accountsObj");

  // End Firebase



  //Test for checking name;
  $scope.startIO = true;
  $scope.checkName = function(){
    var amount = Object.keys($scope.accountsObj).length - 2;
    console.log(amount);

  	for(key in $scope.accountsObj){
  		if($scope.username === key){
  		console.log("This name is taken, please try another one.");
  		$scope.startIO = false;
  		}
  	}

    if ($scope.startIO == true) {
      // Add username to Firebase list of all usernames and passwords
      accountsRef.child($scope.username).set($scope.password);
      // Pass username to model
      PokeModel.setUsername($scope.username);
      window.location.href = "#!/choose";
    }

    $scope.startIO = true;
  }

  $scope.checkPasswordAndGame = function() {
    var found = false;
    for(key in $scope.accountsObj){
  		if($scope.username === key){
        // Found an existing username
        found = true;
        if ($scope.password === $scope.accountsObj[key]) {
          // Pass username to model and start game
          PokeModel.setUsername($scope.username);

          var battleDataRef = firebase.database().ref('/gameData/'+$scope.username+'/');
          var battleDataObj = $firebaseObject(battleDataRef);
          $scope.battleDataObj = battleDataObj;

          battleDataObj.$loaded().then(function() {
            if ($scope.battleDataObj.teamDetails == undefined) {
              window.location.href = "#!/choose";
            } else {
              window.location.href = "#!/battle";
            }
          });


        } else {
          console.log("Your password was incorrect.");
        }
  		}
  	}
    if (!found) {
      // If no name found
      console.log("No account with that username was found.");
    }

  }

});
