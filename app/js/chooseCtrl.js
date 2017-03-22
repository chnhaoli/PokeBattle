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

  // Old Modal popup
  /*$scope.alert = function(pokemonName) {
    var dialog = dialogs.confirm("Confirm choice", "Choose " + pokemonName + " to be on your team?");
    dialog.result.then(function(btn) {
      $scope.team.push(pokemonName);
    }, function(btn) {
      // Do nothing
    })
  }*/


  // Drag and drop - testing

  // Simple
  $scope.models = {
       selected: null,
       lists: {"A": [], "B": []}
   };


   // Generate initial model
   for (var i = 1; i <= 3; ++i) {
       $scope.models.lists.A.push({label: "Item A" + i});
       $scope.models.lists.B.push({label: "Item B" + i});
   }


   // Model to JSON for demo purpose
   $scope.$watch('models', function(model) {
       $scope.modelAsJson = angular.toJson(model, true);
   }, true);

   // Advanced

   /*$scope.dragoverCallback = function(index, external, type, callback) {
      $scope.logListEvent('dragged over', index, external, type);
      // Invoke callback to origin for container types.
      if (type == 'container' && !external) {
          console.log('Container being dragged contains ' + callback() + ' items');
      }
      return index < 10; // Disallow dropping in the third row.
   };

   $scope.dropCallback = function(index, item, external, type) {
      $scope.logListEvent('dropped at', index, external, type);
      // Return false here to cancel drop. Return true if you insert the item yourself.
      return item;
   };

   $scope.logEvent = function(message) {
      console.log(message);
   };

   $scope.logListEvent = function(action, index, external, type) {
      var message = external ? 'External ' : '';
      message += type + ' element was ' + action + ' position ' + index;
      console.log(message);
   };*/

   // Initialize model
   /*$scope.model = [[], []];
   var id = 10;
   angular.forEach(['all', 'move', 'copy', 'link', 'copyLink', 'copyMove'], function(effect, i) {
     var container = {items: [], effectAllowed: effect};
     for (var k = 0; k < 7; ++k) {
       container.items.push({label: effect + ' ' + id++, effectAllowed: effect});
     }
     $scope.model[i % $scope.model.length].push(container);
   });*/

   /*$scope.model = [[], []];
   var id = 10;
   angular.forEach(['all'], function(effect, i) {
     var container = {items: [], effectAllowed: effect};
     for (var k = 0; k < 4; ++k) {
       container.items.push({label: effect + ' ' + id++, effectAllowed: effect});
     }
     $scope.model[i % $scope.model.length].push(container);
   });


   $scope.$watch('model', function(model) {
     $scope.modelAsJson = angular.toJson(model, true);
   }, true);*/


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
