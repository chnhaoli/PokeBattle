// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
pokeBattleApp.factory('Battle',function ($resource, $cookieStore) {
    var that = this;
    //Seleted team of 4 pokemons
    var team = [
        {
            name : 'balbasaur',
            type : ['grass', 'poison'],
            base : {
                hp: 35,
                attack: 44,
                defense: 44,
                spAttack: 44,
                spDefense: 44
            },
            iv : 31,
            skills : ['seed', 'leaf razor', 'sleep_powder', 'poison_powder'],
        },
        {name : 'charmander'},
        {name : 'haunter'},
        {name : 'dragonite'}
    ];
    //Cache of all the pokemons in context.
    // var pokemonCache = [];
    //Cache of all the skills of chosen pokemons.
    var teamSkills = [
        {name : 'seed',
        pp : 10,
        type : 'grass',
        class : 'special',
        accuracy : 90,
        effect : '',
        chance : null,
        power : null,
        heal : null}
    ];
    //Cache of all the skills of enemy.
    var enemySkills = [];
    //Self defination of side effects : name, damage power, chance of cannot perform move.
    var effects = [{name : 'paralysis', power : 0, paralyze : 50},
    {name : 'sleep', power : 0, paralyze : 100},
    {name : 'freeze', power : 5, paralyze : 100},
    {name : 'burn', power : 8, paralyze : 0},
    {name : 'poison', power : 10, paralyze : 0}
];
//API calls
this.GetPokedex = $resource('http://pokeapi.co/api/v2/pokedex/:id',{},{
    get: {
    }
});

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

//Get a randomized interger between 0 and max (default inclusive).
this.randomInt = function(max, exclusive){
    return parseInt(Math.random() * (max + (exclusive ? 0 : 1)));
}

//Current pokemon for detail page
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
