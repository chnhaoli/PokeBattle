// Angular module.
var pokeBattleApp = angular.module('pokeBattle', ['ngRoute','ngResource','ngCookies']);

// Router configuration.
pokeBattleApp.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/homePartial.html'
    }).
    when('/preparation', {
        templateUrl: 'partials/preparationPartial.html',
    }).
    when('/battle', {
        templateUrl: 'partials/battlePartial.html',
    }).
    when('/results', {
        templateUrl: 'partials/resultsPartial.html',
    }).
    // when('/details/:id', {
    //     templateUrl: 'partials/detailPartial.html',
    // }).
    otherwise({
        redirectTo: '/home'
    });
}]);
