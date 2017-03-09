pokeBattleApp.controller('BattleCtrl', function ($scope, dialogs, PokeModel) {

  $scope.team = function() {
    return PokeModel.getTeam();
  }
  
})
