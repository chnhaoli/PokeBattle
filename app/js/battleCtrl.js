pokeBattleApp.controller('BattleCtrl', function ($scope, dialogs, PokeModel) {

  // Team and opponent arrays of pokemon objects
  $scope.teamDetails = [];
  $scope.opponentDetails = [];

  // Booleans to check if loading has finished
  $scope.getTeamDetailsFinished = false;
  $scope.getRandomOpponentFinished = false;
  $scope.loading = true;

  // Booleans used to hide and show subviews
  $scope.mainOptions = true;
  $scope.changeOptions = false;
  $scope.attackOptions = false;
  $scope.itemOptions = false;
  $scope.error = false;

  // Status messages
  $scope.attackMsg = "";
  $scope.damageMsg = "";
  $scope.faintedMsg = "";

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
      // Create a new attribute called movesUsed in the Pokémon object.
      $scope.teamDetails[key].movesUsed = [];
      var pokemon = $scope.teamDetails[key];

      var iterating = function(correctPokemon) {

        for (var i = 0; i < 4; i++) {
          var moveIndex = Math.floor(Math.random() * correctPokemon.moves.length-1) + 1;
          var moveUrl = correctPokemon.moves[moveIndex].move.url;
          // Extracting the move ID from the move's url so we can use it to call the moves API
          var moveId = moveUrl.match(/\/\d+/)[0].substring(1);
          PokeModel.GetMove.get({moveId: moveId}, function(data) {
            console.log(data);
            correctPokemon.movesUsed.push(data);
            callback(data);
          }, function(error) {
            errorCallback(error);
            // TODO: display the error
            $scope.loading = false;
            $scope.error = true;
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
      // If teamDetails has the same number of Pokémons as team, then all Pokémon have been loaded. Proceed with getting moves.
      if ($scope.teamDetails.length === $scope.teamLength) {

        // Get moves of whole team
        $scope.getMovesOfTeam(function(data) {
          // If the last Pokémon on the team's moves have been filled, we have finished getting team details.
          if ($scope.teamDetails[$scope.teamDetails.length-1].movesUsed.length === 4) {
            $scope.getTeamDetailsFinished = true;
            if ($scope.getTeamDetailsFinished === true && $scope.getRandomOpponentFinished === true) {
              // Ready to rumble!
              $scope.loading = false;
            }
          }
        }, function(error) {
          //TODO: display the error
          $scope.loading = false;
          $scope.error = true;

        });
      }

    }, function(error) {
      console.log(error);
      // TODO: display the error
      $scope.loading = false;
      $scope.error = true;
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
      $scope.loading = false;
      $scope.error = true;
    })
  }

  // Call getRandomOpponent() on page start
  $scope.getRandomOpponent();




  // Options menu showing and hiding, and executing user commands
  $scope.goToChange = function() {
    $scope.mainOptions = false;
    $scope.changeOptions = true;
  }

  // Switches the current Pokémon with the chosen Pokémon.
  $scope.changePokemon = function(index) {
    //TODO: change so that I directly change the teamDetails in the model.
    var temp = $scope.teamDetails[0];
    $scope.teamDetails[0] = $scope.teamDetails[index];
    $scope.teamDetails[index] = temp;

    //TODO: Change status message

    //TODO: show next button
  }

  $scope.goToAttack = function() {
    $scope.mainOptions = false;
    $scope.attackOptions = true;
  }

  //TODO: this function is called when next button is clicked.
  $scope.next = function() {
    // Perform opponent move
    PokeModel.performMove();
    // Show main options
  }

  // Carry out the calculations here and decrease the HP bar, as well as change HP value in view.
  $scope.attack = function(index) {


    // TODO: Perform user move
    PokeModel.performMove($scope.teamDetails[0], $scope.opponentDetails[0], $scope.teamDetails[0].movesUsed[index], function(effectiveness) {
      $scope.effectivenessMsg = effectiveness;
    })
    // TODO: Show next button


    // TODO: Use damage to hit opponent, changing their HP bar and HP value displayed. HP is under stats in Pokémon object


    // TODO: Change status message
    $scope.attackMsg = $scope.teamDetails[0].name + " used " + $scope.teamDetails[0].movesUsed[index].name + "!";
    $scope.damageMsg = "The attack did " + damage + " damage!";

    // TODO: if opponent's HP is zero, display fainted message

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
