// Poke controller that we use whenever we have view that needs to
// display or modify the Poke menu
pokeBattleApp.controller('PokeCtrl', function ($scope,PokeModel) {

    // Pokemon
    $scope.clearOffset = function() {
      console.log("clicked clear");
      PokeModel.clearOffset();
    }

});
