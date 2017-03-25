pokeBattleApp.controller('BattleCtrl', function ($scope, dialogs, PokeModel) {

  // Call writeTeamDetails and getRandomOpponent upon page load
  PokeModel.writeTeamDetails();
  PokeModel.getRandomOpponent();

  // Team and opponent arrays of pokemon objects
  $scope.teamDetails = function() {
    return PokeModel.getTeamDetails();
  };

  $scope.opponentDetails = function() {
    return PokeModel.getOppDetails();
  };

  // Booleans to check if loading has finished
  $scope.loading = function() {
    return PokeModel.getIsLoading();
  }

  // Booleans used to hide and show subviews
  $scope.mainOptions = true;
  $scope.changeOptions = false;
  $scope.attackOptions = false;
  $scope.itemOptions = false;
  $scope.nextShow = false;
  $scope.nextOppShow = false;
  $scope.error = false;
  $scope.backDisabled = false;

  // Status messages
  $scope.resetMessages = function() {
    $scope.changeMsg = "";
    $scope.attackMsg = "";
    $scope.damageMsg = "";
    $scope.faintedMsg = "";
    $scope.effectivenessMsg = "";
    $scope.promptMsg = "";
  }
  // Initiating messages
  $scope.resetMessages();

  // Update user's health bar if user = true, else update opponent's health bar.
  $scope.updateHealthBar = function(user) {

    var oppRatio = $scope.opponentDetails().battleStats.HP / $scope.opponentDetails().battleStats.maxHP;

    var userRatio = $scope.teamDetails()[0].battleStats.HP / $scope.teamDetails()[0].battleStats.maxHP;

    var fraction = user ? userRatio : oppRatio;

    // How to do this without document.getElementById?
    var healthBar = user ? document.getElementById("healthBarUser") : document.getElementById("healthBarOpp");

    healthBar.style.width = (fraction * 250)+"px";

    if (fraction > 0.5) {
      healthBar.style["background-color"] = "green";
    } else if (fraction < 0.5 && fraction > 0.2) {
      healthBar.style["background-color"] = "orange";
    } else if (fraction < 0.2) {
      healthBar.style["background-color"] = "red";
    }

  }

  // The user's turn if userTurn = true, else opponent's turn. The user's action was to change Pokémon if changedPokemon = true, else the user's action was to attack.
  $scope.updateHP = function(userTurn, changedPokemon) {

    // 1. User's turn and user changes Pokémon
    // 2. Opponent's turn and opponent attacks
    if ((userTurn && changedPokemon) || (!userTurn && !changedPokemon)) {
      $scope.updateHealthBar(true);
    }

    // 1. User's turn and user attacks
    // 2. Opponent's turn and opponent changes Pokémon
    else if ((userTurn && !changedPokemon) || (!userTurn && changedPokemon)) {
      console.log("hello");
      $scope.updateHealthBar(false);
    }
  }

  // Options menu showing and hiding, and executing user commands
  $scope.goToChange = function() {
    $scope.mainOptions = false;
    $scope.changeOptions = true;
  }

  // Switches the current Pokémon with the chosen Pokémon.
  $scope.changePokemon = function(index) {
    // Reset backDisabled
    $scope.backDisabled = false;
    // Change Pokémon if HP != 0
    if ($scope.teamDetails()[index].battleStats.HP === 0) {
      $scope.resetMessages();
      $scope.changeMsg = "You cannot call out " + $scope.teamDetails()[index].name + " because it has no HP left.";
    } else {
      PokeModel.changePokemon(index);
      $scope.resetMessages();
      $scope.changeMsg = "You called out " + $scope.teamDetails()[0].name + "!";

      //show next button
      $scope.nextShow = true;
      $scope.changeOptions = false;

      //update HP bar
      $scope.updateHP(true, true);
    }

  }

  $scope.goToAttack = function() {
    $scope.mainOptions = false;
    $scope.attackOptions = true;
  }

  //Called when next button is clicked.
  $scope.nextTurn = function() {
    // Perform opponent move
    var randomNum = Math.floor(Math.random() * 4);
    PokeModel.performMove($scope.opponentDetails(), $scope.teamDetails()[0], $scope.opponentDetails().movesUsed[randomNum], function(effectiveness) {
      $scope.effectivenessMsg = effectiveness;
    }, function(missed) {
      $scope.effectivenessMsg = missed;
    });

    // Change status message
    $scope.attackMsg = $scope.opponentDetails().name + " used " + $scope.opponentDetails().movesUsed[randomNum].name + "!";

    // Use damage to hit user, changing their HP bar and HP value displayed. HP is under stats in Pokémon object
    $scope.updateHP(false, false);

    // Show main options
    $scope.nextShow = false;
    $scope.mainOptions = true;

    // if user's HP is zero, display fainted message, switch user Pokémon.
    if ($scope.teamDetails()[0].battleStats.HP === 0) {
      $scope.faintedMsg = $scope.teamDetails()[0].name + " fainted!";
      // Display popup - is it needed?
      $scope.changeMsg = "Choose which Pokémon to call out:";
      $scope.changeOptions = true;
      $scope.mainOptions = false;
      $scope.backDisabled = true;
    }
  }

  $scope.nextOpponent = function() {
    $scope.resetMessages();
    $scope.promptMsg = "What will you do?"
    $scope.nextOppShow = false;
    $scope.mainOptions = true;
    PokeModel.getRandomOpponent(function() {
      $scope.updateHP(true, false);
    });
  }

  // Carry out the calculations here and decrease the HP bar, as well as change HP value in view.
  $scope.attack = function(index) {


    // TODO: Perform user move
    PokeModel.performMove($scope.teamDetails()[0], $scope.opponentDetails(), $scope.teamDetails()[0].movesUsed[index], function(effectiveness) {
      console.log("eff: " + effectiveness);
      $scope.effectivenessMsg = effectiveness;
    }, function(missed) {
      console.log("missed: " + missed);
      $scope.effectivenessMsg = missed;
    })

    // TODO: Use damage to hit opponent, changing their HP bar and HP value displayed. HP is under stats in Pokémon object
    $scope.updateHP(true, false);

    // Change status message
    $scope.attackMsg = $scope.teamDetails()[0].name + " used " + $scope.teamDetails()[0].movesUsed[index].name + "!";

    // Show next button and hide attacks
    $scope.nextShow = true;
    $scope.attackOptions = false;

    // TODO: if opponent's HP is zero, display fainted message, switch opponent Pokémon.
    if ($scope.opponentDetails().battleStats.HP === 0) {
      $scope.faintedMsg = $scope.opponentDetails().name + " fainted!";
      // Display popup - do we need to?
      //$scope.open('sm', $scope.opponentDetails.name, false);
      $scope.nextShow = false;
      $scope.nextOppShow = true;
    }

  }

  $scope.back = function() {
    if ($scope.backDisabled) {
      $scope.promptMsg = "You cannot go back.";
    } else {
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

  }


  // Modal popup - testing

  /*var $ctrl = this;

  $ctrl.animationsEnabled = true;

  // user: If user's Pokémon fainted, then true, else if opponent's Pokémon fainted, then false.
  $scope.open = function (size, pokemonName, isUser, parentSelector) {
    console.log("open");
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        isUser: function() {
          return isUser;
        },
        pokemonName: function() {
          return pokemonName;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };
  */

})


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

/*pokeBattleApp.controller('ModalInstanceCtrl', function ($uibModalInstance, pokemonName, isUser, PokeModel) {

  var $ctrl = this;
  $ctrl.pokemonName = pokemonName;
  $ctrl.title = isUser ? pokemonName + " fainted!";

  $ctrl.ok = function () {
    $uibModalInstance.close();
    if (!user) {
      PokeModel.getRandomOpponent();
    }
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}); */
