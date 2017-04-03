pokeBattleApp.controller('BattleCtrl', function ($scope, $uibModal, $firebaseObject, PokeModel) {

  // Booleans to check if loading has finished
  /*$scope.isLoading = function() {
    return PokeModel.getIsLoading();
  }*/

  $scope.isLoading = true;

  // Booleans used to hide and show subviews
  $scope.mainOptions = false;
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

    //Reset messages on Firebase
    PokeModel.resetFirebaseMessages();

    // battleDataRef.child("changeMsg").remove();
    // battleDataRef.child("attackMsg").remove();
    // battleDataRef.child("damageMsg").remove();
    // battleDataRef.child("faintedMsg").remove();
    // battleDataRef.child("effectivenessMsg").remove();
    // battleDataRef.child("promptMsg").remove();
  }

  $scope.username = function() {
    return PokeModel.getUsername();
  }

  // Update user's health bar if user = true, else update opponent's health bar.
  $scope.updateHealthBar = function(user) {

    // var oppRatio = $scope.opponentDetails().battleStats.HP / $scope.opponentDetails().battleStats.maxHP;
    // var userRatio = $scope.teamDetails()[0].battleStats.HP / $scope.teamDetails()[0].battleStats.maxHP;
    // var fraction = user ? userRatio : oppRatio;
    //
    // // How to do this without document.getElementById?
    // var healthBar = user ? document.getElementById("healthBarUser") : document.getElementById("healthBarOpp");
    //
    // healthBar.style.width = (fraction * 250)+"px";
    //
    // if (fraction > 0.5) {
    //   healthBar.style["background-color"] = "green";
    // } else if (fraction < 0.5 && fraction > 0.2) {
    //   healthBar.style["background-color"] = "orange";
    // } else if (fraction < 0.2) {
    //   healthBar.style["background-color"] = "red";
    // }

  }

  // The user's turn if userTurn = true, else opponent's turn. The user's action was to change Pokémon if changedPokemon = true, else the user's action was to attack.
  $scope.updateHP = function(userTurn, changedPokemon) {

    // // 1. User's turn and user changes Pokémon
    // // 2. Opponent's turn and opponent attacks
    // if ((userTurn && changedPokemon) || (!userTurn && !changedPokemon)) {
    //   $scope.updateHealthBar(true);
    // }
    //
    // // 1. User's turn and user attacks
    // // 2. Opponent's turn and opponent changes Pokémon
    // else if ((userTurn && !changedPokemon) || (!userTurn && changedPokemon)) {
    //   $scope.updateHealthBar(false);
    // }
  }

  // Loads Firebase data to see if data exists or not, and set scope values accordingly.
  PokeModel.loadFirebaseData(function(gamedataExists, battleDataObj) {
    // For three-way data bindings, bind it to the scope instead
    battleDataObj.$bindTo($scope, "battleDataObj");
    $scope.isLoading = false;

    if (!gamedataExists) {
      $scope.mainOptions = true;
      $scope.resetMessages();
      $scope.promptMsg = "What will you do?"
    } else {
      switch (battleDataObj.currentMenu) {
        case "main":
          $scope.mainOptions = true;
          $scope.promptMsg = "What will you do?"
          break;
        case "nextOpp":
          $scope.nextOppShow = true;
          break;
        case "next":
          $scope.nextShow = true;
          break;
        case "change":
          $scope.changeOptions = true;
          break;
      }
      console.log($scope.changeOptions);

      if (battleDataObj.changeMsg)
        $scope.changeMsg = battleDataObj.changeMsg;
      if (battleDataObj.attackMsg)
        $scope.attackMsg = battleDataObj.attackMsg;
      if (battleDataObj.damageMsg)
        $scope.damageMsg = battleDataObj.damageMsg;
      if (battleDataObj.faintedMsg)
        $scope.faintedMsg = battleDataObj.faintedMsg;
      if (battleDataObj.effectivenessMsg)
        $scope.effectivenessMsg = battleDataObj.effectivenessMsg;
      if (battleDataObj.changeMsg)
        $scope.promptMsg = battleDataObj.promptMsg;

      $scope.updateHealthBar(true);
      $scope.updateHealthBar(false);
    }
  }, function(error) {
    //console.log(error);
    //console.log(error.config.url.substring(33));
    $scope.errorMsg = "There was an error loading "+ error.config.url.substring(33) + " (problem with the API). Please go back and choose another Pokémon."
    $scope.isLoading = false;
  })

  // // Firebase
  // var battleDataRef = firebase.database().ref('/gameData/'+$scope.username()+'/');
  //
  // var battleDataObj = $firebaseObject(battleDataRef);
  //
  // // to take an action after the data loads, use the $loaded() promise
  // battleDataObj.$loaded().then(function() {
  //   console.log("loaded record:", battleDataObj.$id, battleDataObj.teamDetails);
  //
  //   // To iterate the key/value pairs of the object, use angular.forEach()
  //   angular.forEach(battleDataObj, function(value, key) {
  //     console.log(key, value);
  //   });
  //
  //   console.log(battleDataObj.teamDetails);
  //
  //   // If there is no saved data, get data from API, otherwise get saved data from Firebase.
  //   if (battleDataObj.teamDetails == undefined || battleDataObj.teamDetails == null) {
  //     console.log("hello");
  //     // Get new data from API
  //
  //     // Call writeTeamDetails and getRandomOpponent upon page load
  //     //PokeModel.writeTeamDetails();
  //     //PokeModel.getRandomOpponent();
  //
  //     PokeModel.getAllDetails(function() {
  //       battleDataRef.child("teamDetails").set(angular.fromJson(angular.toJson($scope.teamDetails())));
  //       battleDataRef.child("oppDetails").set(angular.fromJson(angular.toJson($scope.opponentDetails())));
  //       battleDataRef.child("score").set(angular.fromJson(angular.toJson($scope.score())));
  //       //$scope.isLoading = false;
  //     })
  //
  //     $scope.mainOptions = true;
  //
  //     // Initiating messages
  //     $scope.resetMessages();
  //     PokeModel.setScore(0);
  //   } else {
  //     // Load saved data from Firebase and set to scope.
  //     console.log($scope.battleDataObj.teamDetails);
  //     PokeModel.setTeamDetails(battleDataObj.teamDetails);
  //     PokeModel.setOppDetails(battleDataObj.oppDetails);
  //     PokeModel.setScore(battleDataObj.score);
  //     console.log($scope.changeOptions);
  //
  //     switch (battleDataObj.currentMenu) {
  //       case "main":
  //         $scope.mainOptions = true;
  //         break;
  //       case "nextOpp":
  //         $scope.nextOppShow = true;
  //         break;
  //       case "next":
  //         $scope.nextShow = true;
  //         break;
  //       case "change":
  //         $scope.changeOptions = true;
  //         break;
  //     }
  //     console.log($scope.changeOptions);
  //
  //     if (battleDataObj.changeMsg)
  //       $scope.changeMsg = battleDataObj.changeMsg;
  //     if (battleDataObj.attackMsg)
  //       $scope.attackMsg = battleDataObj.attackMsg;
  //     if (battleDataObj.damageMsg)
  //       $scope.damageMsg = battleDataObj.damageMsg;
  //     if (battleDataObj.faintedMsg)
  //       $scope.faintedMsg = battleDataObj.faintedMsg;
  //     if (battleDataObj.effectivenessMsg)
  //       $scope.effectivenessMsg = battleDataObj.effectivenessMsg;
  //     if (battleDataObj.changeMsg)
  //       $scope.promptMsg = battleDataObj.promptMsg;
  //
  //     $scope.updateHealthBar(true);
  //     $scope.updateHealthBar(false);
  //
  //     //$scope.isLoading = false;
  //   }
  // });
  //
  // // To make the data available in the DOM, assign it to $scope
  // $scope.battleDataObj = battleDataObj;

  // Highscore Reference
  var highscoreRef = firebase.database().ref('/highscores/');

  // Team and opponent arrays of pokemon objects
  $scope.teamDetails = function() {
    return PokeModel.getTeamDetails();
  };

  $scope.opponentDetails = function() {
    return PokeModel.getOppDetails();
  };


  $scope.score = function() {
    return PokeModel.getScore();
  }

  // Options menu showing and hiding, and executing user commands
  $scope.goToChange = function() {
    $scope.mainOptions = false;
    $scope.changeOptions = true;
  }

  // Switches the current Pokémon with the chosen Pokémon.
  $scope.changePokemon = function(index) {
    // Change Pokémon if HP != 0
    if ($scope.teamDetails()[index].battleStats.HP === 0) {
      $scope.resetMessages();
      $scope.changeMsg = "You cannot call out " + $scope.teamDetails()[index].name + " because it has no HP left.";
      //Update to Firebase
      //battleDataRef.child("changeMsg").set($scope.changeMsg);

      PokeModel.updateToFirebase("changeMsg", $scope.changeMsg);

    } else {
      // Reset backDisabled
      $scope.backDisabled = false;

      PokeModel.changePokemon(index);
      $scope.resetMessages();
      $scope.changeMsg = "You called out " + $scope.teamDetails()[0].name + "!";


      // $scope.battleDataObj.changeMsg = $scope.changeMsg;
      // $scope.battleDataObj.backDisabled = false;
      // $scope.battleDataObj.currentMenu = "next";
      // $scope.battleDataObj.teamDetails = angular.fromJson(angular.toJson($scope.teamDetails()));
      // $scope.battleDataObj.$save()

      //Update to Firebase
      PokeModel.updateToFirebase("backDisabled", false);
      PokeModel.updateToFirebase("changeMsg", $scope.changeMsg);
      PokeModel.updateToFirebase("currentMenu", "next");
      PokeModel.updateToFirebase("teamDetails", angular.fromJson(angular.toJson($scope.teamDetails())));

      //battleDataRef.child("backDisabled").set(false);
      //battleDataRef.child("changeMsg").set($scope.changeMsg);
      //battleDataRef.child("currentMenu").set("next");
      //battleDataRef.child("teamDetails").set(angular.fromJson(angular.toJson($scope.teamDetails())));

      //show next button
      $scope.nextShow = true;
      $scope.changeOptions = false;

      //update HP bar
      // $scope.updateHP(true, true);
    }

  }

  $scope.goToAttack = function() {
    $scope.mainOptions = false;
    $scope.attackOptions = true;
  }

  //Called when next button is clicked.
  $scope.nextTurn = function() {

    $scope.resetMessages();

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
    // $scope.updateHP(false, false);

    // Show main options
    $scope.nextShow = false;
    $scope.mainOptions = true;

    //Update to Firebase

    // $scope.battleDataObj.effectivenessMsg = $scope.effectivenessMsg;
    // $scope.battleDataObj.attackMsg = $scope.attackMsg;
    // $scope.battleDataObj.currentMenu = "main";
    // $scope.battleDataObj.teamDetails = angular.fromJson(angular.toJson($scope.teamDetails()));
    // $scope.battleDataObj.$save();

    PokeModel.updateToFirebase("effectivenessMsg", $scope.effectivenessMsg);
    PokeModel.updateToFirebase("attackMsg", $scope.attackMsg);
    PokeModel.updateToFirebase("currentMenu", "main");
    PokeModel.updateToFirebase("teamDetails", angular.fromJson(angular.toJson($scope.teamDetails())));

    // battleDataRef.child("effectivenessMsg").set($scope.effectivenessMsg);
    // battleDataRef.child("attackMsg").set($scope.attackMsg);
    // battleDataRef.child("currentMenu").set("main");
    // battleDataRef.child("teamDetails").set(angular.fromJson(angular.toJson($scope.teamDetails())));

    // if user's HP is zero, display fainted message, switch user Pokémon.
    if ($scope.teamDetails()[0].battleStats.HP === 0) {
      $scope.faintedMsg = $scope.teamDetails()[0].name + " fainted!";
      // Update to Firebase
      // $scope.battleDataObj.faintedMsg = $scope.faintedMsg;

      PokeModel.updateToFirebase("faintedMsg", $scope.faintedMsg);

      // battleDataRef.child("faintedMsg").set($scope.faintedMsg);

      var countFainted = 1;
      for (var i = 1; i < 4; i++) {
        if ($scope.teamDetails()[i].battleStats.HP === 0) {
          countFainted += 1;
        } else {
          break;
        }
      }

      if (countFainted === 4) {
        // Game over

        // Update to Firebase - set highscore
        highscoreRef.child($scope.username()).set($scope.score());
        // Update to Firebase - erase game data so user can start new game.
        battleDataRef.remove();

        // Popup
        setTimeout(function() {
          $scope.open("sm");
        }, 1000);
      } else {
        $scope.changeMsg = "Choose which Pokémon to call out:";

        $scope.changeOptions = true;
        $scope.mainOptions = false;
        $scope.backDisabled = true;

        // Update to Firebase
        // $scope.battleDataObj.changeMsg = $scope.changeMsg;
        // $scope.battleDataObj.currentMenu = "change";
        // $scope.battleDataObj.backDisabled = true;
        // $scope.battleDataObj.$save();

        PokeModel.updateToFirebase("changeMsg", $scope.changeMsg);
        PokeModel.updateToFirebase("currentMenu", "change");
        PokeModel.updateToFirebase("backDisabled", true);

        //
        // battleDataRef.child("changeMsg").set($scope.changeMsg);
        // battleDataRef.child("currentMenu").set("change");
        // battleDataRef.child("backDisabled").set(true);
      }
    }
  }

  $scope.nextOpponent = function() {
    $scope.resetMessages();
    $scope.promptMsg = "What will you do?"
    $scope.nextOppShow = false;
    $scope.mainOptions = true;

    //Update to Firebase
    // $scope.battleDataObj.promptMsg = $scope.promptMsg;
    // $scope.battleDataObj.currentMenu = "main";
    // $scope.battleDataObj.$save();

    PokeModel.updateToFirebase("promptMsg", $scope.promptMsg);
    PokeModel.updateToFirebase("currentMenu", "main");


    // battleDataRef.child("promptMsg").set($scope.promptMsg);
    // battleDataRef.child("currentMenu").set("main");

    $scope.isLoading = true;
    PokeModel.getRandomOpponent(function() {
      $scope.isLoading = false;
      // $scope.updateHP(true, false);

      //Update to Firebase
      // $scope.battleDataObj.oppDetails = angular.fromJson(angular.toJson($scope.opponentDetails()));
      // $scope.battleDataObj.$save()

      PokeModel.updateToFirebase("oppDetails", angular.fromJson(angular.toJson($scope.opponentDetails())));

      // battleDataRef.child("oppDetails").set(angular.fromJson(angular.toJson($scope.opponentDetails())));
    });
  }

  // Carry out the calculations here and decrease the HP bar, as well as change HP value in view.
  $scope.attack = function(index) {

    $scope.resetMessages();

    // Perform user move
    PokeModel.performMove($scope.teamDetails()[0], $scope.opponentDetails(), $scope.teamDetails()[0].movesUsed[index], function(effectiveness) {
      console.log("eff: " + effectiveness);
      $scope.effectivenessMsg = effectiveness;
    }, function(missed) {
      console.log("missed: " + missed);
      $scope.effectivenessMsg = missed;
    })

    // TODO: Use damage to hit opponent, changing their HP bar and HP value displayed. HP is under stats in Pokémon object
    // $scope.updateHP(true, false);

    // Change status message
    $scope.attackMsg = $scope.teamDetails()[0].name + " used " + $scope.teamDetails()[0].movesUsed[index].name + "!";

    // Show next button and hide attacks
    $scope.nextShow = true;
    $scope.attackOptions = false;

    //Update to Firebase
    // $scope.battleDataObj.effectivenessMsg = $scope.effectivenessMsg;
    // $scope.battleDataObj.attackMsg = $scope.attackMsg;
    // $scope.battleDataObj.currentMenu = "next";
    // $scope.battleDataObj.oppDetails = angular.fromJson(angular.toJson($scope.opponentDetails()));
    // $scope.battleDataObj.$save();

    PokeModel.updateToFirebase("oppDetails", angular.fromJson(angular.toJson($scope.opponentDetails())));
    PokeModel.updateToFirebase("effectivenessMsg", $scope.effectivenessMsg);
    PokeModel.updateToFirebase("currentMenu", "next");
    PokeModel.updateToFirebase("attackMsg", $scope.attackMsg);

    // battleDataRef.child("effectivenessMsg").set($scope.effectivenessMsg);
    // battleDataRef.child("attackMsg").set($scope.attackMsg);
    // battleDataRef.child("currentMenu").set("next");
    // battleDataRef.child("oppDetails").set(angular.fromJson(angular.toJson($scope.opponentDetails())));

    //Check if is fainted;
    $scope.isTeamFainted = function(order){
        return $scope.teamDetails()[order].battleStats.HP === 0;
    }

    // if opponent's HP is zero, display fainted message, increase score, switch opponent Pokémon.
    if ($scope.opponentDetails().battleStats.HP === 0) {
      PokeModel.increaseScore();
      $scope.faintedMsg = $scope.opponentDetails().name + " fainted!";
      $scope.nextShow = false;
      $scope.nextOppShow = true;

      //Update to Firebase
      // $scope.battleDataObj.currentMenu = "nextOpp";
      // $scope.battleDataObj.faintedMsg = $scope.faintedMsg;
      // $scope.battleDataObj.score = angular.fromJson(angular.toJson($scope.score()));
      // $scope.battleDataObj.$save()

      PokeModel.updateToFirebase("score", angular.fromJson(angular.toJson($scope.score())));
      PokeModel.updateToFirebase("faintedMsg", $scope.faintedMsg);
      PokeModel.updateToFirebase("currentMenu", "nextOpp");
      //
      // battleDataRef.child("currentMenu").set("nextOpp");
      // battleDataRef.child("faintedMsg").set($scope.faintedMsg);
      // battleDataRef.child("score").set(angular.fromJson(angular.toJson($scope.score())));
    }

  }

  $scope.back = function() {
    $scope.resetMessages();

    if ($scope.backDisabled) {
      $scope.promptMsg = "You cannot go back.";
    } else {
      $scope.mainOptions = true;
      $scope.promptMsg = "What will you do?";
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


  // Modal popup - testing - question: can I reuse this code so I don't have to have it in both battleCtrl and chooseCtrl? It seems hard because they display different things

  var $ctrl = this;

  $ctrl.animationsEnabled = true;

  $scope.open = function (size, parentSelector) {
    console.log("open");
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      backdrop: 'static',
      templateUrl: 'myModalContent.html',
      controller: 'BattleModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        score: function() {
          return $scope.score;
        }
      }
    });

    /*modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });*/
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };


})


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

pokeBattleApp.controller('BattleModalInstanceCtrl', function ($uibModalInstance, score, $location) {

  var highscoreRef = firebase.database().ref('/highscores/');

  var $ctrl = this;
  $ctrl.score = score;

  $ctrl.highscore = function () {
    $uibModalInstance.close();
    // Go to highscore page - Question: why doesn't ng-href work in the partial? That's why I had to include the line here.
    $location.path("/highscore");
  };

  $ctrl.newGame = function() {
    $location.path("/choose");
  }
});
