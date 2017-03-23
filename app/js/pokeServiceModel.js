// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
pokeBattleApp.factory('PokeModel',function ($resource, $cookieStore) {
    var that = this;
    var isLoading = false;
    // Global variables
    var offset = 0;
    var team = [];
    var opponentDetails = {};

    var teamDetails = [
        {
            name : 'balbasaur',
            type : ['grass', 'poison'],
            // baseHP : 35,
            // baseAttack: 44,
            // baseDefense: 44,
            // baseSpAttack: 44,
            // baseSpDefense: 44,
            stats : {maxHP : null,
                attack : null,
                defense : null,
                spAttack : null,
                spDefense : null,
                HP : null
            },
            moves : [/*{},{}*/],
            movesUsed : [{name, type, damageClass, accuracy, power},{},{},{}]
        },
        {name : 'charmander'},
        {name : 'haunter'},
        {name : 'dragonite'}
    ];
    //Cache of all the pokemons in context.
    // var pokemonCache = [];
    //Cache of all the skills of chosen pokemons.
    //{}

    //Get a randomized interger between 0 and max (default inclusive).
    this.randomInt = function(max, exclusive){
        return Math.round(Math.random() * (max + (exclusive ? 0 : 1)));
    }

    //Calculate the stats as level 100 assumed
    this.clacStats = function (baseHP, baseAttack, baseDefense, baseSpAttack, baseSpDefense){
        var atkIV = that.randomInt(15);
        var defIV = that.randomInt(15);
        var spIV = that.randomInt(15);
        var hpIV = atkIV%2==1?8:0 + defIV%2==1?4:0 + randomInt(1)*2 + spIV%2==1?1:0;
        var stats = {};
        stats.maxHP = Math.round((baseHP + hpIV) * 2 + 110);
        stats.attack = Math.round((baseAttack + atkIV) * 2 + 5);
        stats.defense = Math.round((baseDefense + defIV) * 2 + 5);
        stats.spAttack = Math.round((baseSpAttack + spIV) * 2 + 5);
        stats.spDefense = Math.round((baseSpDefense + spIV) * 2 + 5);
        stats.HP = stats.maxHP;
        return stats;
    }
    //API: move;
    this.GetMove = $resource('http://pokeapi.co/api/v2/move/:moveId', {}, {
        get: {

        }
    });
    //GET: Get 4 random moves for a pokemon;
    this.getMoves = function(pokemon){
        for (var i = 0; i < 4; i++){
            that.GetMove.get({moveId : pokemon.moves[that.randomInt(pokemon.moves.length)].name)}, function(data){
                //pokemon.movesUsed.x = xxxxx;
            })
        }
    }
    //API: pokemon;
    this.GetPokemon = $resource('http://pokeapi.co/api/v2/pokemon/:pokemonNameOrId', {}, {
        get: {

        }
    });
    // GET: For all Pokémon names in team array, gets Pokémon details and passes that into an array teamDetails.
    // Special function in a function passing in key as index, called directly, ensuring the key gets updated from 0 to team.length-1.
    this.writeTeamDetails = function() {
        for (var key in team) {
            var pokemonName = team[key];
            that.getPokemon(pokemonName, function(index) {
                return function(data) {
                    teamDetails[index] = data;
                    //*******
                    that.getMoves(teamDetails[index]);
                }
            }(key), function (error) {
                errorCallback(error);
            })
        }
    }
    //Returns the team details;
    this.getTeamDetails = function() {
        return teamDetails;
    }
    //GET: pokemon for choosing;
    this.getAllPokemon = function(callback, errorCallback) {
        this.GetPokemon.get({offset: offset}, function(data) {
            offset += 20;
            console.log(offset);
            callback(data);
        }, function(error) {
            errorCallback(error);
        })
    }
    //Clear the offset;
    this.clearOffset = function() {
        offset = 0;
    }
    //GET: Get pokemon for searching;
    this.getPokemon = function(pokemonNameOrId, callback, errorCallback) {
        this.GetPokemon.get({pokemonNameOrId: pokemonNameOrId}, function(data) {
            callback(data);
        }, function(error) {
            errorCallback(error);
        })
    }
    //Adds pokemon to selected team;
    this.addToTeam = function(pokemonName) {
        team.push(pokemonName);
        console.log(team);

    }
    //Returns the selected team;
    this.getTeam = function() {
        return team;
    }
    //GET: Get a random opponent;
    this.getRandomOpponent = function() {
        var randomNum = Math.floor(Math.random() * 150) + 1
        this.getPokemon(randomNum, function(data) {
            opponentDetails = {};
            opponentDetails = data;
            that.getMoves(opponentDetails);
        }, function(error) {
            console.log(error);
        })
    }

    /************ Battle damages **********/
    /************ If a pokemon do not have type2, pass a 'undefined' or false **********/

    //If the move is on target (true) or miss (false);
    this.isOnTarget = function(accuracy) {
        return accuracy ? (that.randomInt(100,true) < accuracy) : true;
    }
    //Get the effectiveness;
    this.getEffectiveness = function(moveType, oppType1, oppType2){
        var types = ['normal','fire','water','electric','grass','ice','fighting','poision','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
        var effectivenessMatrix = [
            [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,0.5,  0,  1,  1,0.5,  1],
            [  1,0.5,0.5,  1,  2,  2,  1,  1,  1,  1,  1,  2,0.5,  1,0.5,  1,  2,  1],
            [  1,  2,0.5,  1,0.5,  1,  1,  1,  2,  1,  1,  1,  2,  1,0.5,  1,  1,  1],
            [  1,  1,  2,0.5,0.5,  1,  1,  1,  0,  2,  1,  1,  1,  1,0.5,  1,  1,  1],
            [  1,0.5,  2,  1,0.5,  1,  1,0.5,  2,0.5,  1,0.5,  2,  1,0.5,  1,0.5,  1],
            [  1,0.5,0.5,  1,  2,0.5,  1,  1,  2,  2,  1,  1,  1,  1,  2,  1,0.5,  1],
            [  2,  1,  1,  1,  1,  2,  1,0.5,  1,0.5,0.5,0.5,  2,  0,  1,  2,  2,0.5],
            [  1,  1,  1,  1,  2,  1,  1,0.5,0.5,  1,  1,  1,0.5,0.5,  1,  1,  0,  2],
            [  1,  2,  1,  2,0.5,  1,  1,  2,  1,  0,  1,0.5,  2,  1,  1,  1,  2,  1],
            [  1,  1,  1,0.5,  2,  1,  2,  1,  1,  1,  1,  2,0.5,  1,  1,  1,0.5,  1],
            [  1,  1,  1,  1,  1,  1,  2,  2,  1,  1,0.5,  1,  1,  1,  1,  0,0.5,  1],
            [  1,0.5,  1,  1,  2,  1,0.5,0.5,  1,0.5,  2,  1,  1,0.5,  1,  2,0.5,0.5],
            [  1,  2,  1,  1,  1,  2,0.5,  1,0.5,  2,  1,  2,  1,  1,  1,  1,0.5,  1],
            [  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  2,  1,0.5,  1,  1],
            [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,0.5,  0],
            [  1,  1,  1,  1,  1,  1,0.5,  1,  1,  1,  2,  1,  1,  2,  1,0.5,  1,0.5],
            [  1,0.5,0.5,0.5,  1,  2,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,0.5,  2],
            [  1,0.5,  1,  1,  1,  1,  2,0.5,  1,  1,  1,  1,  1,  1,  2,  2,0.5,  1],
        ];
        return effectivenessMatrix[types.indexOf(moveType)][typs.indexOf(oppType1)] * (oppType2 ? effectivenessMatrix[types.indexOf(moveType)][typs.indexOf(oppType2)] : 1);
    }
    //Tell the description of effectiveness;
    this.tellEffectiveness = function(effectiveness){
        switch(effectiveness) {
            case 0:
            return 'It seems no effect.';
            //break;
            case 0.25:
            case 0.5:
            return 'It seems not so effective.';
            //break;
            case 2:
            case 4:
            return 'Super effective.';
            //break;
            default:
            return '';
        }
    }
    //Get the same type attack bonus: if pokemon type = move type, 1.5; if not, 1.
    this.getSTAB = function(moveType, type1, type2) {
        return (type1 == moveType || type2 == moveType) ? 1.5 : 1;
    }
    //Get the damage //(0.4*level+2) = 42 as level 100 assumed
    this.getDamage = function(move, pokemon, oppPokemon){
        if(move.damageClass == 'physical'){
            atk = pokemon.attack;
            def = oppPokemon.defense;
        }
        else if(move.damageClass == 'special'){
            atk = pokemon.spAttack;
            def = oppPokemon.spDefense;
        }
        else {
            alert('Damage class error');
        }
        effectiveness = that.getEffectiveness(move.type, oppPokemon.type1, oppPokemon.type2);
        stab = that.getSTAB(moveType, pokemon.type, pokemon.type2);
        return Math.round((42*move.power*atk/def/50+2)*effectiveness*stab*(that.randomInt(15)+85)/100);
    }
    //Get the pokemon HP after the damages
    this.poseDamage = function(hp, damage){
        return (hp > damage) ? (hp - damage) : 0;
    }
    //If the pokemon is dying.
    this.isDying = function(pokemon) {
        return pokemon.hp == 0;
    }
    //Perform the attack, callbacks the effectiveness category and if it is dying; or the miss status;
    this.performMove = function(pokemon, oppPokemon, move, callbackHit, callbackMiss){
        if(that.isOnTarget()){
            //On target;
            tempHP = that.poseDamage(oppPokemon.hp, that.getDamage(move, pokemon, oppPokemon);
            oppPokemon.hp = (tempHP > 0) ? tempHP : 0;
            callbackHit(that.tellEffectiveness(that.getEffectiveness(move.type, oppPokemon.type1, oppPokemon.type2)), that.isDying(oppPokemon));
        }
        else{
            //Missed;
            callbackMiss('The attack missed.');
        }
        return true;
    }


    //Cookies
    // this.storeCookie = function(id, content){
    //     $cookieStore.put(id, '');
    //     $cookieStore.put(id, content);
    // }
    //
    // this.getCookie = function(id){
    //     return $cookieStore.get(id);
    // }
    //
    // this.getDishFromCookie = function(menuInId){
    //     var menu = [];
    //     var dish = {};
    //     for(idFlag = 0; idFlag < menuInId.length; idFlag++) {
    //         that.GetDish.get({id:menuInId[idFlag]},function(data){
    //             dish = {};
    //             dish.id = data.id;
    //             dish.title = data.title;
    //             dish.image = data.image;
    //             dish.price = 0;
    //             for(ingredient = 0; ingredient < data.extendedIngredients.length; ingredient++){
    //                 dish.price += data.extendedIngredients[ingredient].amount;
    //             }
    //             dish.price = dish.price;
    //             dish.preparation = data.instructions;
    //             menu.push(dish);
    //         },function(data){
    //         });
    //     }
    //     return menu;
    // }

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
