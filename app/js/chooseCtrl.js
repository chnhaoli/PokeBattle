pokeBattleApp.controller('ChooseCtrl', function ($scope, $uibModal, PokeModel) {

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
  $scope.pokemonTypes = [];

  PokeModel.setShowContinue(bool);

  $scope.randomTeam = function(){
      PokeModel.getRandomTeam();
      console.log(PokeModel.getTeam());
  }

  $scope.loading = true;

  //Pokemon
  $scope.team = function() {
    return PokeModel.getTeam();
  };

  $scope.isFourMem = function(){
    if( $scope.team().length == 4){
      return true;
    }
    else{
      return false;
    }
  }

  $scope.isInList = function(name) {
    return PokeModel.getIsInTeam(name);
  }

  $scope.addToTeam = function(pokemonName){
    if ($scope.team().length > 3) {
      $scope.openTip();
    }
    else
    {
      PokeModel.addToTeam(pokemonName);
    }

  }

  $scope.deleteFromTeam = function(pokemonName){
    PokeModel.deleteFromTeam(pokemonName);
    console.log($scope.team());
  }


  $scope.swapTwoPokemon = function(index1, index2) {
    PokeModel.swapTwoPokemon(index1, index2);
  }

  $scope.pokemonTypes = function(type) {
    return PokeModel.restructureTypes(type);
  }

  //Message box
  var $ctrl = this;
  $ctrl.animationsEnabled = true;
  $scope.open = function (size, pokemon, parentSelector) {
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
        team: function () {
          return $scope.team();
        },
        pokemon: function() {
          return $scope.selectedPokemonDetail;
        },
        openTip: function() {
          //return $scope.openTip();
        },
        isFourMem: function() {
          return $scope.isFourMem();
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

  $scope.openTip = function (size, parentSelector) {
    //Get specific pokemon's info
    var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContentMessageTip.html',
      controller: 'ModalInstanceTipCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {}
    });

    /*modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });*/
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
    else {
        PokeModel.GetPokeByType.get({typeId: type}, function(data){
            for (i in data.pokemon){
                if(filter === data.pokemon[i].pokemon.name){
                    searchresult.push(data.pokemon[i]);
                }
            }
            $scope.pokeByType = searchresult;
        },function(data) {
            console.log("Something went wrong");
        });
    }
  }


  $scope.checkIfEnter = function(event, filter, type) {
    event.preventDefault();
    if (event.keyCode == 13) {
        $scope.searchPoke(filter, type);
    }
  }
});


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
pokeBattleApp.controller('ModalInstanceCtrl', function ($uibModalInstance, team, pokemon, openTip, isFourMem, PokeModel) {

  var $ctrl = this;
  $ctrl.pokemon = pokemon;
  console.log(isFourMem);
  $ctrl.isFourMem = function() {
    return isFourMem;
  }


  $ctrl.isInListDialogue = function() {
    return PokeModel.getIsInTeam($ctrl.pokemon.name);
  }

  $ctrl.getPokemonTypes = function(type){
    return PokeModel.restructureTypes(type);
  }

  $ctrl.ok = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    console.log(team.length);
    if (team.length == 4) {
      console.log("open tip");
      //openTip;
    } else {
      console.log("add to team");
      PokeModel.addToTeam($ctrl.pokemon.name);
    }
  };

  $ctrl.delete = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
    PokeModel.deleteFromTeam($ctrl.pokemon.name);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.



pokeBattleApp.controller('ModalInstanceTipCtrl', function ($uibModalInstance, PokeModel) {

  var $ctrl = this;

  $ctrl.ok = function () {
    //$uibModalInstance.close($ctrl.selected.item);
    $uibModalInstance.close();
  };
});
