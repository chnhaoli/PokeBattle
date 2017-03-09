// Poke controller that we use whenever we have view that needs to
// display or modify the Poke menu
pokeBattleApp.controller('PokeCtrl', function ($scope,PokeModel) {

    // Pokemon
    $scope.clearOffset = function() {
      console.log("clicked clear");
      PokeModel.clearOffset();
    }


    // Dinner example

    $scope.numberOfGuests = PokeModel.getNumberOfGuests();

    $scope.setNumberOfGuest = function(number){
        PokeModel.setNumberOfGuests(number);
    }

    $scope.getNumberOfGuests = function() {
        return PokeModel.getNumberOfGuests();
    }

    $scope.plusNumberOfGuests = function() {
        PokeModel.setNumberOfGuests(PokeModel.getNumberOfGuests() + 1);
        $scope.numberOfGuests = PokeModel.getNumberOfGuests();
    }

    $scope.minusNumberOfGuests = function() {
        PokeModel.setNumberOfGuests(PokeModel.getNumberOfGuests() - 1);
        $scope.numberOfGuests = PokeModel.getNumberOfGuests();
    }

    $scope.selectedMenu = PokeModel.getSelectedMenu();
    $scope.getTotalCost = function(){
        return PokeModel.getTotalPrice() * PokeModel.getNumberOfGuests();
    }
});
