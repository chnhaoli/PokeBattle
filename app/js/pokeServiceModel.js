// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
pokeBattleApp.factory('PokeModel',function ($resource, $cookieStore) {
    var that = this;

    // Global variables
    var offset = 0;
    var team = [];
    var teamDetails = [];
    var opponentDetails = [];

    //API calls
    this.SearchDish = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search',{},{
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });
    this.GetDish = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/:id/information',{},{
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });

    this.GetPokemon = $resource('http://pokeapi.co/api/v2/pokemon/:pokemonNameOrId', {}, {
      get: {

      }
    });

    this.GetMove = $resource('http://pokeapi.co/api/v2/move/:moveId', {}, {
      get: {

      }
    })

    this.GetPokeByType = $resource('http://pokeapi.co/api/v2/type/:typeId', {}, {
      get: {

      }
    })

    //Cookies
    this.storeCookie = function(id, content){
        $cookieStore.put(id, '');
        $cookieStore.put(id, content);
    }

    this.getCookie = function(id){
        return $cookieStore.get(id);
    }


    this.getDishFromCookie = function(menuInId){
        var menu = [];
        var dish = {};
        for(idFlag = 0; idFlag < menuInId.length; idFlag++) {
            that.GetDish.get({id:menuInId[idFlag]},function(data){
                dish = {};
                dish.id = data.id;
                dish.title = data.title;
                dish.image = data.image;
                dish.price = 0;
                for(ingredient = 0; ingredient < data.extendedIngredients.length; ingredient++){
                    dish.price += data.extendedIngredients[ingredient].amount;
                }
                dish.price = dish.price;
                dish.preparation = data.instructions;
                menu.push(dish);
            },function(data){
            });
        }
        return menu;
    }

    //Pokemon
    this.getAllPokemon = function(callback, errorCallback) {
      this.GetPokemon.get({offset: offset}, function(data) {
        offset += 20;
        console.log(offset);
        callback(data);
      }, function(error) {
        errorCallback(error);
      })
    }

    this.clearOffset = function() {
      offset = 0;
    }

    this.getPokemon = function(pokemonNameOrId, callback, errorCallback) {
      this.GetPokemon.get({pokemonNameOrId: pokemonNameOrId}, function(data) {
        callback(data);
      }, function(error) {
        errorCallback(error)
      })
    }

    this.getMove = function(url, callback, errorCallback) {
      this.GetMove.get({url: url}, function(data){
        callback(data);
      }, function(error) {
        errorCallback(error);
      })
    }

    this.setTeam = function(teamToSet) {
      team = teamToSet;
      console.log(team);
    }

    this.addToTeam = function(pokemonName) {
      team.push(pokemonName);
      console.log(team);

    }

    this.getTeam = function() {
      return team;
    }

    // For all Pokémon names in team array, gets Pokémon details and passes that into an array teamDetails.
    // Special function in a function passing in key as index, called directly, ensuring the key gets updated from 0 to team.length-1.
    this.getTeamDetails = function(callback, errorCallback) {
      for (var key in team) {
        var pokemonName = team[key];
        this.getPokemon(pokemonName, function(index) {
          return function(data) {
            teamDetails[index] = data;
            callback(index, data);
          }
        }(key), function (error) {
          errorCallback(error);
        })
      }
    }

    // Gets a random opponent
    this.getRandomOpponent = function(callback, errorCallback) {
      var randomNum = Math.floor(Math.random() * 150) + 1
      this.getPokemon(randomNum, function(data) {
        opponentDetails = data;
        callback(data);
      }, function(error) {
        // TODO: display the error
        console.log(error);
        errorCallback(error);
      })
    }











    //Guests
    var numberOfGuests = that.getCookie('num') ? that.getCookie('num') : 1;

    //Writes the number of guests
    this.setNumberOfGuests = function(num) {
        if(num != numberOfGuests){
            numberOfGuests = num >= 1 ? num : 1;
            this.storeCookie('num', num);
        }
    }

    //Returns the current number of guests
    this.getNumberOfGuests = function() {
        return numberOfGuests;
    }

    //Current dish
    var currentDish = {};

    //Writes the current dish
    this.setCurrentDish = function(data){
        currentDish = {};
        currentDish.id = data.id;
        currentDish.title = data.title;
        currentDish.image = data.image;
        currentDish.price = 0;
        for(ingredient = 0; ingredient < data.extendedIngredients.length; ingredient++){
            currentDish.price += data.extendedIngredients[ingredient].amount;
        }
        currentDish.price = currentDish.price;
        currentDish.preparation = data.instructions;
    }

    this.getCurrentDish = function(){
        return currentDish;
    }

    //Selected menu
    var selectedMenu = that.getCookie('menu') ? that.getDishFromCookie(that.getCookie('menu')) : [];

    //Returns the selected menu
    this.getSelectedMenu = function(){
        return selectedMenu;
    }

    this.getTotalPrice = function(){
        totalPrice = 0;
        for(dishFlagK = 0; dishFlagK < selectedMenu.length; dishFlagK++){
            totalPrice += selectedMenu[dishFlagK].price;
        }
        return totalPrice;
    }

    this.addDish = function(id){
        if(id == currentDish.id){
            selectedMenu.push(currentDish);
        }
        that.storeCookie('menu', that.getAllId(selectedMenu));
    }

    this.removeDish = function(id){
        for(dishFlagI = 0; dishFlagI < selectedMenu.length; dishFlagI++){
            if(id == selectedMenu[dishFlagI].id){
                selectedMenu.splice(dishFlagI, 1);
                break;
            }
        }
        that.storeCookie('menu', that.getAllId(selectedMenu));
    }

    this.isOnMenu = function(id){
        var is = false;
        for(dishFlagJ = 0; dishFlagJ < selectedMenu.length; dishFlagJ++ ){
            if(id == selectedMenu[dishFlagJ].id){
                is = true;
                break;
            }
        }
        return is;
    }

    this.getAllId = function(menu){
        var allId = [];
        for (key in menu){
            allId.push(menu[key].id);
        }
        return allId;
    }

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
