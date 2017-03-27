pokeBattleApp.controller('ChooseCtrl', function ($scope, $uibModal, $log, dialogs, PokeModel) {

  // Initial scope values
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
  $scope.filter = '';
  $scope.pokeByType = '';

  $scope.loading = true;

  //Pokemon
  $scope.team = function() {
    return PokeModel.getTeam();
  };


  $scope.isInList = function(name) {
    return PokeModel.getIsInTeam(name);
  }

  $scope.addToTeam = function(pokemonName){
    PokeModel.addToTeam(pokemonName);   
  }

  $scope.deleteFromTeam = function(pokemonName){
    PokeModel.deleteFromTeam(pokemonName);
    PokeModel.getTeam();
  }


  $scope.swapTwoPokemon = function(index1, index2) {
    PokeModel.swapTwoPokemon(index1, index2);
  }
  
  //Message box
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


    //get pokemon by type
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
    }

    $scope.getPokeByType($scope.type);


    //get detail information of a pokemon
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


    // Search pokemon with type and filter
    $scope.searchPoke = function(filter, type){
      var searchresult = [];
      if(filter === ''){
        $scope.getPokeByType($scope.type);
      }
      else{     
        PokeModel.GetPokeByType.get({typeId: type}, function(data){
          for (i in data.pokemon){
            if(filter === data.pokemon[i].pokemon.name){
              searchresult.push(data.pokemon[i]);
            }}
            $scope.pokeByType = searchresult; 
          },function(data){
            console.log("Something went wrong");
          });
      }}

});


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
pokeBattleApp.controller('ModalInstanceCtrl', function ($uibModalInstance, pokemonName, PokeModel) {

  var $ctrl = this;
  $ctrl.pokemonName = pokemonName;

  $ctrl.isInListDialogue = function() {
    console.log(11111);
    return PokeModel.getIsInTeam($ctrl.pokemonName.name);
  }

  $ctrl.ok = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    PokeModel.addToTeam($ctrl.pokemonName.name);
  };

  $ctrl.delete = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    PokeModel.deleteFromTeam($ctrl.pokemonName.name);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


//progressbar controller
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
