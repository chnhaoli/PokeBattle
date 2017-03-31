// Poke controller that we use whenever we have view that needs to
// display or modify the Poke menu
pokeBattleApp.controller('PokeCtrl', function ($scope, $firebaseObject, PokeModel) {

  // Firebase
  var usernamesRef = firebase.database().ref('/usernames/');

  var existingUsernames = $firebaseObject(usernamesRef);

  // to take an action after the data loads, use the $loaded() promise
  existingUsernames.$loaded().then(function() {
    console.log("loaded record:", existingUsernames.$id, existingUsernames.$value);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(existingUsernames, function(value, key) {
      console.log(key, value);
    });
  });

  // To make the data available in the DOM, assign it to $scope
  $scope.existingUsernames = existingUsernames;

  // For three-way data bindings, bind it to the scope instead
  existingUsernames.$bindTo($scope, "existingUsernames");
  console.log($scope.existingUsernames);

  // End Firebase

  //Test for checking name;
  $scope.startIO = true;
  $scope.checkName = function(){
    var amount = Object.keys($scope.existingUsernames).length - 2;
    console.log(amount);

  	for(i in $scope.existingUsernames){
  		if($scope.username === $scope.existingUsernames[i]){
  		console.log("This name is taken, please try another one.");
  		$scope.startIO = false;
  		}
  	}

    if ($scope.startIO == true) {
      // Add username to Firebase list of all usernames and passwords
      usernamesRef.child(amount).set($scope.username);
      // Pass username to model
      PokeModel.setUsername($scope.username);
      window.location.href = "#!/choose";
    }

    $scope.startIO = true;
  }

  $scope.userNameList = ["John", "Mary", "Phillip"];
});
