pokeBattleApp.controller('HighscoreCtrl', function ($scope, $uibModal, $firebaseObject, PokeModel) {

  var highscoreRef = firebase.database().ref('/highscores/');
  var highscoreObj = $firebaseObject(highscoreRef);

  $scope.highscoreObj = highscoreObj;

  $scope.highscoreArray = [];
  highscoreObj.$loaded().then(function() {
    angular.forEach(highscoreObj, function(value, key) {
      console.log(value.username, value.score);
      $scope.highscoreArray.push([value.username, value.score]);
    })
    $scope.highscoreArray.push(["Bob", 100]);
    $scope.highscoreArray.push(["Pikachu", 5]);
    $scope.highscoreArray.push(["Squirtle", 101]);

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
  //   // Sorting from highest score to lowest - I don't really know how this works... but it works
  //   $scope.highscoreArray.sort(function(a,b) {
  //     return b[1] - a[1];
  //   })
  // })

})
