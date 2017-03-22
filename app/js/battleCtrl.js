pokeBattleApp.controller('BattleCtrl', function ($scope, dialogs, PokeModel) {

  $scope.teamDetails = [];
  $scope.opponentDetails = [];
  $scope.getTeamDetailsFinished = false;
  $scope.getRandomOpponentFinished = false;
  $scope.loading = true;

  $scope.mainOptions = true;
  $scope.changeOptions = false;
  $scope.attackOptions = false;
  $scope.itemOptions = false;

  // Getting the team array with only Pokémon names (will we need to this here later?)
  $scope.team = function() {
    return PokeModel.getTeam();
  }

  // Getting the length of the team array with only Pokémon names.
  $scope.teamLength = PokeModel.getTeam().length;

  // Randomly hit the health bar - testing
  $scope.hit = function() {
    // How to do this without document.getElementById?
    var healthBar = document.getElementById("healthBar");
    var randomNum = Math.random();
    healthBar.style.width = (randomNum * 250)+"px";

    if (randomNum > 0.5) {
      healthBar.style["background-color"] = "green";
    } else if (randomNum < 0.5 && randomNum > 0.2) {
      healthBar.style["background-color"] = "orange";
    } else if (randomNum < 0.2) {
      healthBar.style["background-color"] = "red";
    }
  }

  // Load details of each Pokémon move used, for each Pokémon in the team. We will have to call 16 different API endpoints...
  // TODO: Add a check so I can't add two of the save moves
  $scope.getMovesOfTeam = function(callback, errorCallback) {
    for (var key in $scope.teamDetails) {
      $scope.teamDetails[key].movesUsed = [];
      var pokemon = $scope.teamDetails[key];

      var iterating = function(correctPokemon) {

        for (var i = 0; i < 4; i++) {
          var moveIndex = Math.floor(Math.random() * correctPokemon.moves.length-1) + 1;
          var moveUrl = correctPokemon.moves[moveIndex].move.url;
          var moveId = moveUrl.match(/\/\d+/)[0].substring(1);
          PokeModel.GetMove.get({moveId: moveId}, function(data) {
            console.log(data);
            correctPokemon.movesUsed.push(data);
            callback(data);
          }, function(error) {
            errorCallback(error);
            // TODO: display the error
          })
        }

      }(pokemon)
    }
  }

  // Load the details of each Pokémon on the team so they are available to use in the scope.
  $scope.getTeamDetails = function() {
    if ($scope.teamLength === 0) {
      $scope.getTeamDetailsFinished = true;
    }

    PokeModel.getTeamDetails(function(index, data) {
      $scope.teamDetails[index] = data;
      if ($scope.teamDetails.length === $scope.teamLength) {

        // Get moves of whole team
        $scope.getMovesOfTeam(function(data) {

          if ($scope.teamDetails[$scope.teamDetails.length-1].movesUsed.length === 4) {

            console.log($scope.teamDetails);

            $scope.getTeamDetailsFinished = true;
            if ($scope.getTeamDetailsFinished === true && $scope.getRandomOpponentFinished === true) {
              // Ready to rumble!
              $scope.loading = false;
            }
          }
        }, function(error) {

        });
      }

    }, function(error) {
      console.log(error);
      // TODO: display the error
    });
  }

  // Call getTeamDetails() on page start
  $scope.getTeamDetails();

  // Generate a random opponent
  $scope.getRandomOpponent = function() {
    PokeModel.getRandomOpponent(function(data) {
      // Always save to the 0th index, new opponenets will take place of old ones.
      $scope.opponentDetails[0] = data;
      $scope.getRandomOpponentFinished = true;

      if ($scope.getTeamDetailsFinished === true && $scope.getRandomOpponentFinished === true) {
        // Ready to rumble!
        $scope.loading = false;
      }

    }, function(error) {
      console.log(error)
      //TODO: display the error
    })
  }

  // Call getRandomOpponent() on page start
  $scope.getRandomOpponent();




  // Options menu showing and hiding, and executing user commands
  $scope.goToChange = function() {
    $scope.mainOptions = false;
    $scope.changeOptions = true;
  }
  $scope.changePokemon = function(index) {
    var temp = $scope.teamDetails[0];
    $scope.teamDetails[0] = $scope.teamDetails[index];
    $scope.teamDetails[index] = temp;
  }

  $scope.goToAttack = function() {
    $scope.mainOptions = false;
    $scope.attackOptions = true;
  }

  $scope.attack = function() {

  }

  $scope.back = function() {
    $scope.mainOptions = true;
    if ($scope.changeOptions) {
      $scope.changeOptions = false;
    }

    if ($scope.attackOptions) {
      $scope.attackOptions = false;
    }

    if ($scope.itemOptions) {
      $scope.itemOptions = false;
    }

  }

})
