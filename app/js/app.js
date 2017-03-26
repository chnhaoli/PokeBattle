

// We setup the main Angular model that we will use for our application
// Good Angular practice is to organize your code in different modules,
// for instance, one module per feature. However, since our App is
// simple we will keep all the code in the "dinnerPlanner" module
//
// Notice the 'ngRoute' and 'ngResource' in the module declaration. Those are some of the core Angular
// modules we are going to use in this app. If you check the index.html you will
// also see that we included separate JavaScript files for these modules. Angular
// has other core modules that you might want to use and explore when you go deeper
// into developing Angular applications. For this lab, these two will suffice.
var pokeBattleApp = angular.module('pokeBattle', ['ngRoute','ngResource','ngCookies', 'dialogs.main', 'ui.bootstrap', 'dndLists']);


// Here we configure our application module and more specifically our $routeProvider.
// Route provider is used to tell angular to load a specific partial (view) for an individual
// specific address that is provided in the browser. This enables us to change the browser address
// even if we are not reloading the page. We can also use back and forward button to navigate between
// our screens. The paths that you use in the conditions of $routeProvider will be shown in the address
// bar after the # sign. So, for instance, the home path will be 'http://localhost:8000/#/home'.
//
// In index.html you will notice the <div ng-view></div> tag. This is where the specific view sill be
// loaded. For instance when you go to http://localhost:8000/, since your path does not match any
// of the when conditions, the otherwise condition is triggered and tells the app to redirect to '/home'.
// The '/home' condition then loads the 'partials/home.html'.
//
// Apart from specifying the partial HTML that needs to be loaded with your app, you can also specify which
// controller should be responsible for that view. In the controller you will setup the initial data or
// access the data from the model and create the methods that you will link to events. Remember, controllers
// can be nested, so you can have one controller responsible for the whole view, but then another one for
// some sub part of the view. In such way you can reuse your controller on different parts of the view that
// might have similar logic.
//
// In some cases we want the path to be variable (e.g. contain the dish id). To define the variable part of
// the path we use the ":" sign. For instance, our '/dish/:dishId' will be triggered when we access
// 'http://localhost:8000/#/dish/12345'. The 12345 value will be stored in a dishId parameter, which we can
// then access through $routeParams service. More information on this in the dishCtrl.js

// Router configuration.
pokeBattleApp.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/homePartial.html',
        controller: 'PokeCtrl'
    }).
    when('/choose', {
        templateUrl: 'partials/choosePartial.html',
        controller: 'ChooseCtrl'
    }).
    when('/details/:id', {
        templateUrl: 'partials/detailPartial.html',
    }).
    when('/battle', {
        templateUrl: 'partials/battlePartial.html',
        controller: 'BattleCtrl'
    }).
    when('/highscore', {
        templateUrl: 'partials/highscorePartial.html',
    }).
    otherwise({
        redirectTo: '/home'
    });
}]);

// Testing with directives

pokeBattleApp.directive('dndElement', function() {
  return {
    replace: 'true',
    template: '<img class="chosenPokemon" ng-src="https://img.pokemondb.net/artwork/{{pokemonName}}.jpg" index="{{$index}}">',
    link: function(scope, elem, attr) {
      var dragSrcEl = null;

      elem.attr('draggable', 'true');

      elem.on('dragstart', function(e) {
        $('.ui-draggable-dragging').addClass('dragging');
        e.target.style.opacity = '0.4';  // this / e.target is the source node.
        //elem.css('opacity', '0.4');


        //console.log(attr.index);
        //console.log(scope.team());
        var firstPokemon = scope.team()[attr.index];
        var firstPokemonIndex = attr.index;

        //e.originalEvent.dataTransfer.setData("firstElement", e.target);
        e.originalEvent.dataTransfer.setData("firstPokemon", firstPokemon);
        e.originalEvent.dataTransfer.setData("firstPokemonIndex", firstPokemonIndex);


        dragSrcEl = e.target;
        console.log(dragSrcEl);

        /*e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text/html", e.target.innerHTML);*/
      })


      elem.on('dragover', function(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
      })

      elem.on('dragenter', function(e) {
        // Add stuff here
      })

      elem.on('dragleave', function(e) {
        // Add stuff here
      })

      elem.on('drop', function(e) {
        // this / e.target is current target element.

        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }

        var secondPokemon = scope.team()[attr.index];
        var secondPokemonIndex = attr.index;
        //var firstElement = e.originalEvent.dataTransfer.getData("firstElement");
        var firstPokemon = e.originalEvent.dataTransfer.getData("firstPokemon");
        var firstPokemonIndex = e.originalEvent.dataTransfer.getData("firstPokemonIndex");
        //console.log(firstElement);

        if (firstPokemon != secondPokemon) {
          scope.swapTwoPokemon(firstPokemonIndex, secondPokemonIndex);
          scope.$apply();
        }
        //console.log($('.ui-draggable-dragging'));
        //$('.ui-draggable-dragging').removeClass('dragging');
        //$('.ui-draggable-dragging').classList.remove('over');

        //firstElement.style.opacity = '1';
        //firstElement.classList.remove('over');
        //e.target.classList.remove('over');


        /*if (dragSrcEl != e.target) {
          console.log(dragSrcEl);
          console.log(e.target);
          dragSrcEl.innerHTML = e.target.innerHTML;
          e.target.innerHTML = e.originalEvent.dataTransfer.getData("text/html");
        }*/

        // Why is dragSrcEl null?
        console.log(dragSrcEl);

        dragSrcEl.style.opacity = '1';
        dragSrcEl.classList.remove('over');  // this / e.target is previous target element.
        e.target.classList.remove('over');  // this / e.target is previous target element.


        return false;
      })

      /*elem.on('dragend', function(e) {
        // this/e.target is the source node.

        [].forEach.call(cols, function (col) {
          col.classList.remove('over');
        });
      })*/


    }
  }
})
