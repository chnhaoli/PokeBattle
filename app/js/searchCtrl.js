pokeBattleApp.controller('SearchCtrl', function ($scope,Battle) {

    // Dinner.Dish.get({id:583901})

    $scope.search = {
        filter: '',
        region: '1'
    }
    $scope.regions = [
        {id:'1', name:'National'},
        {id:'2', name:'Kanto'},
        {id:'3', name:'Johto'},
        {id:'4', name:'Hoenn'},
        {id:'5', name:'Original Sinnoh'},
        {id:'6', name:'Extended Sinnoh'},
        {id:'7', name:'Updated Johto'},
        {id:'8', name:'Original Unova'},
        {id:'9', name:'Updated Unova'}
    ];
    $scope.pokedex = '';
    $scope.getPokedex = function(id) {
        $scope.isLoading = true;
        $scope.isError = false;
        Battle.GetPokedex.get({id:id},function(data){
            $scope.pokedex = data.pokemon_entries;
            $scope.isLoading = false;
        },function(data){
            $scope.isLoading = false;
            $scope.isError = true;
        });
    }
    $scope.getPokedex($scope.search.region);
});
