pokeBattleApp.controller('ChooseCtrl', function ($scope, $uibModal, $log, dialogs, PokeModel) {

  // Initial scope values
  $scope.allPokemonNames = [];
  $scope.selectedPokemonDetail = [];

  $scope.types = [
  {id:'1', name:'Normal'},
  {id:'2', name:'Fighting'},
  {id:'3', name:'Flying'},
  {id:'4', name:'Poison'},
  {id:'5', name:'Ground'},
  {id:'6', name:'Rock'},
  {id:'7', name:'Bug'},
  {id:'8', name:'Ghost'},
  {id:'9', name:'Steel'},
  {id:'10', name:'Fire'},
  {id:'11', name:'Water'},
  {id:'12', name:'Grass'},
  {id:'13', name:'Electric'},
  {id:'14', name:'Psychic'},
  {id:'15', name:'Ice'},
  {id:'16', name:'Dragon'},
  {id:'17', name:'Dark'},
  {id:'18', name:'Fairy'}
  ];

  $scope.type = '1';

  $scope.pokeByType =' ';

  $scope.loading = true;

  //Pokemon

  $scope.team = function() {
    return PokeModel.getTeam();
  };

  // $scope.getAllPokemon = function() {
  //   $scope.loading = true;
  //   PokeModel.getAllPokemon(function(results) {
  //     for (key in results.results) {
  //       var pokemon = results.results[key];
  //       $scope.allPokemonNames.push(pokemon.name.replace(/-/g, ""));
  //       //console.log(pokemon.name.replace(/-/g, ""));
  //     }
  //     $scope.loading = false;
  //   }, function(error) {
  //     console.log(error);
  //     // TODO: implement error message on view
  //   })
  // }


  // $scope.getAllPokemon();

  // Modal popup - testing

  var $ctrl = this;

  $ctrl.animationsEnabled = true;

  $scope.open = function (size, pokemonName, parentSelector) {
    console.log("open");
      //Get specific pokemon's info
      var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
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
            console.log($scope.selectedPokemonDetail);
            return $scope.selectedPokemonDetail;
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

  $scope.getPokeByType = function(id) {
    $scope.isLoading = true;
    $scope.isError = false;
    PokeModel.GetPokeByType.get({typeId:id},function(data){
      $scope.pokeByType = data.pokemon;
      $scope.isLoading = false;
    },function(data){
      $scope.isLoading = false;
      $scope.isError = true;
    });
    console.log("exit");
  }

  $scope.getPokeByType($scope.type);

  $scope.getPokemonDetail = function(pokemonName) {
    $scope.isLoading = true;
    $scope.isError = false;
    PokeModel.GetPokemon.get({pokemonNameOrId:pokemonName},function(data){
      $scope.selectedPokemonDetail = data;
      console.log($scope.selectedPokemonDetail);
      $scope.open('md', pokemonName);
      $scope.isLoading = false;
  },function(data){
     $scope.isLoading = false;
     $scope.isError = true;
   });
  }


  $scope.searchPoke = function(filter, type){
    var searchresult = [];
    if(filter === ''){
      $scope.getPokeByType($scope.type);
    }
    else{     
    PokeModel.GetPokeByType.get({typeId: type}, function(data){
      for (i in data.pokemon){
        console.log(data.pokemon[i].pokemon.name);
        if(filter === data.pokemon[i].pokemon.name){
          console.log("hahaahahahqusiba");
          searchresult.push(data.pokemon[i]);
        }}
        $scope.pokeByType = searchresult; 
    },function(data){
      console.log("Something went wrong");
    });
    }}
    // $scope.isLoading = true;
    // $scope.isError = false;
    // PokeModel.GetPokemon.get({pokemonNameOrId:$scope.filter},function(data){
    //   console.log("hellohahahaha");
    //   console.log(data);
    //   $scope.isLoading = false;
    // },function(data){
    //   $scope.isLoading = false;
    //   $scope.isError = true;
    // });
  

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
   for (var i = 0; i <= 3; ++i) {
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


<<<<<<< HEAD
=======
  // Modal popup - testing

  //search bar function 



  var $ctrl = this;

  $ctrl.animationsEnabled = true;

  $scope.open = function (size, pokemonName, parentSelector) {
    console.log("open");
      //Get specific pokemon's info
      var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
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
            console.log($scope.selectedPokemonDetail.forms.name);
            return $scope.selectedPokemonDetailS;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $ctrl.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
>>>>>>> edcdc586f9ce1da894cd1c73067e3cf37ba1e335


  })

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

pokeBattleApp.controller('ModalInstanceCtrl', function ($uibModalInstance, pokemonName, PokeModel) {

  var $ctrl = this;
  $ctrl.pokemonName = pokemonName;

  $ctrl.ok = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    PokeModel.addToTeam($ctrl.pokemonName.name);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


pokeBattleApp.controller('ProgressDemoCtrl', function ($scope) {
  $scope.max = 200;

  $scope.random = function() {
    var value = Math.floor(Math.random() * 100 + 1);
    var type = 'info';
    $scope.type = type;
  };

  $scope.random();

  $scope.randomStacked = function() {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor(Math.random() * 4 + 1); i < n; i++) {
        var index = Math.floor(Math.random() * 4);
        $scope.stacked.push({
          value: Math.floor(Math.random() * 30 + 1),
          type: types[index]
        });
    }
  };

  $scope.randomStacked();
});
