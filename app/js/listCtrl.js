// Dinner controller that we use whenever we have view that needs to
// display or modify the dinner menu
dinnerPlannerApp.controller('ListCtrl', function ($scope,Dinner) {

    $scope.numberOfGuests = Dinner.getNumberOfGuests();

    $scope.setNumberOfGuest = function(number){
        Dinner.setNumberOfGuests(number);
    }

    $scope.getNumberOfGuests = function() {
        return Dinner.getNumberOfGuests();
    }

    $scope.plusNumberOfGuests = function() {
        Dinner.setNumberOfGuests(Dinner.getNumberOfGuests() + 1);
        $scope.numberOfGuests = Dinner.getNumberOfGuests();
    }

    $scope.minusNumberOfGuests = function() {
        Dinner.setNumberOfGuests(Dinner.getNumberOfGuests() - 1);
        $scope.numberOfGuests = Dinner.getNumberOfGuests();
    }

    $scope.selectedMenu = Dinner.getSelectedMenu();
    $scope.getTotalCost = function(){
        return Dinner.getTotalPrice() * Dinner.getNumberOfGuests();
    }
});
