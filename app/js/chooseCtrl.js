pokeBattleApp.controller('ChooseCtrl', function ($scope, $uibModal, $log, dialogs, PokeModel) {

  // Initial scope values
  $scope.allPokemonNames = []
  $scope.loading = true;

  //Pokemon

  $scope.team = function() {
    return PokeModel.getTeam();
  };

  $scope.getAllPokemon = function() {
    $scope.loading = true;
    PokeModel.getAllPokemon(function(results) {
      for (key in results.results) {
        var pokemon = results.results[key];
        $scope.allPokemonNames.push(pokemon.name.replace(/-/g, ""));
        //console.log(pokemon.name.replace(/-/g, ""));
      }
      $scope.loading = false;
    }, function(error) {
      console.log(error);
      // TODO: implement error message on view
    })
  }


  $scope.getAllPokemon();

  /*$scope.alert = function(pokemonName) {
    var dialog = dialogs.confirm("Confirm choice", "Choose " + pokemonName + " to be on your team?");
    dialog.result.then(function(btn) {
      $scope.team.push(pokemonName);
    }, function(btn) {
      // Do nothing
    })
  }*/

  $scope.showConfirmed = function() {
    console.log($scope.team);
  }


  // Modal popup - testing

  var $ctrl = this;

  $ctrl.animationsEnabled = true;

  $scope.open = function (size, pokemonName, parentSelector) {
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
        items: function () {
          return $ctrl.items;
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

})

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

pokeBattleApp.controller('ModalInstanceCtrl', function ($uibModalInstance, pokemonName, PokeModel) {

  var $ctrl = this;
  $ctrl.pokemonName = pokemonName;

  $ctrl.ok = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    PokeModel.addToTeam($ctrl.pokemonName);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
