pokeBattleApp.controller('HighscoreCtrl', function ($scope, $uibModal, $firebaseObject, PokeModel) {

  var highscoreRef = firebase.database().ref('/highscores/');
  var highscoreObj = $firebaseObject(highscoreRef);

  $scope.highscoreObj = highscoreObj;

  $scope.highscoreArray = [];
  highscoreObj.$loaded().then(function() {

    // $scope.highscoreArray.push(["Bob", 100]);
    // $scope.highscoreArray.push(["Pikachu", 5]);
    // $scope.highscoreArray.push(["Squirtle", 101]);
    // $scope.highscoreArray.push(["Bulbasaur", 1000]);

    angular.forEach(highscoreObj, function(value, key) {
      $scope.highscoreArray.push([value.username, value.score]);
      //$scope.highscoreArray.push(['Charmander', 16])
    })

    console.log($scope.highscoreArray);
    for (key in $scope.highscoreArray) {
      var value = $scope.highscoreArray[key];
      console.log(value[0],typeof(value[1]));
    }

    //Sorting from highest score to lowest - I don't really know how this works... but it works
    $scope.highscoreArray.sort(function(a,b) {
      return b[1] - a[1];
    })

  })

  // $scope.highscoreArray = [];
  // highscoreObj.$loaded().then(function() {
  //   angular.forEach(highscoreObj, function(value, key) {
  //     console.log(key, value);
  //     $scope.highscoreArray.push([key, value]);
  //   });
  //   $scope.highscoreArray.push(["Bob", 100]);
  //   $scope.highscoreArray.push(["Pikachu", 5]);
  //   $scope.highscoreArray.push(["Squirtle", 101]);
  //
  //   console.log($scope.highscoreArray);
  //   for (key in $scope.highscoreArray) {
  //     var value = $scope.highscoreArray[key];
  //     console.log(value[0],typeof(value[1]));
  //   }
  //
  //   // Sorting from highest score to lowest - I don't really know how this works... but it works
  //   $scope.highscoreArray.sort(function(a,b) {
  //     return b[1] - a[1];
  //   })
  // })

})
