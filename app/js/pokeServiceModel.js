// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
pokeBattleApp.factory('PokeModel',function ($resource, $cookieStore) {
    var that = this;
    //For loading widget;
    var isLoading = false;
    //Team in pokemon name;
    var team = [1,2,3,4];
    //Detailed opponent;
    var opponentDetails = {};
    //Detailed pokemons for whole team;
    var teamDetails = [
        // {
        //     name : 'balbasaur',
        //     types : [
        //     {
        //       "slot": 2,
        //       "type": {
        //         "url": "http://pokeapi.co/api/v2/type/4/",
        //         "name": "poison"
        //       }
        //     },
        //     {
        //       "slot": 1,
        //       "type": {
        //         "url": "http://pokeapi.co/api/v2/type/12/",
        //         "name": "grass"
        //       }
        //     }
        //   ],
        //    type : [],
        //     // baseHP : 35,
        //     // baseAttack: 44,
        //     // baseDefense: 44,
        //     // baseSpAttack: 44,
        //     // baseSpDefense: 44,
        //     battleStats : {maxHP : null,
        //         attack : null,
        //         defense : null,
        //         spAttack : null,
        //         spDefense : null,
        //         HP : null
        //     },
        //     moves : [/*{},{}*/],
        //     movesUsed : [{name, type, damageClass, accuracy, power},{},{},{}]
        // },
        // {name : 'charmander'},
        // {name : 'haunter'},
        // {name : 'dragonite'}
    ];
    //Cache of all the pokemons in context.
    // var pokemonCache = [];
    //Cache of all the skills of chosen pokemons.
    //{}

    //Offset for listing pokemons;
    var offset = 0;
    //API: pokemon;
    this.GetPokemon = $resource('http://pokeapi.co/api/v2/pokemon/:pokemonNameOrId', {}, {
        get: {

        }
    });

    this.getIsLoading = function() {
        return isLoading;
    }
    //GET: pokemon for choosing;
    this.getAllPokemon = function(callback, errorCallback) {
        isLoading = true;
        this.GetPokemon.get({offset: offset}, function(data) {
            offset += 20;
            console.log(offset);
            isLoading = false;
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
        isLoading = true;
        this.GetPokemon.get({pokemonNameOrId: pokemonNameOrId}, function(data) {
            isLoading = false;
            callback(data);
        }, function(error) {
            errorCallback(error);
        })
    }
    //Get a randomized interger between 0 and max (default inclusive).
    this.randomInt = function(max){
        return Math.floor(Math.random() * (max + 1));
    }
    //Calculate the stats as level 100 assumed
    this.calcStats = function (pokemon){
        var atkIV = that.randomInt(15);
        var defIV = that.randomInt(15);
        var spdIV = that.randomInt(15);
        var spIV = that.randomInt(15);
        var hpIV = atkIV%2==1?8:0 + defIV%2==1?4:0 + spdIV%2==1?2:0 + spIV%2==1?1:0;
        var statsUsed = {};
        var level = pokemon.level ? pokemon.level : 100;
        statsUsed.maxHP     = Math.round((pokemon.stats[5].base_stat + hpIV ) * 2 * level / 100 + 110);
        statsUsed.attack    = Math.round((pokemon.stats[4].base_stat + atkIV) * 2 * level / 100 + 5);
        statsUsed.defense   = Math.round((pokemon.stats[3].base_stat + defIV) * 2 * level / 100 + 5);
        statsUsed.spAttack  = Math.round((pokemon.stats[2].base_stat + spIV ) * 2 * level / 100 + 5);
        statsUsed.spDefense = Math.round((pokemon.stats[1].base_stat + spIV ) * 2 * level / 100 + 5);
        statsUsed.speed = Math.round((pokemon.stats[0].base_stat + spIV ) * 2 * level / 100 + 5);
        statsUsed.HP = statsUsed.maxHP;
        return statsUsed;
    }
    //Store types as pokemon.type = [type1, type2];
    this.restructureTypes = function(types){
        var type = [];
        if (types.length == 1){
            type[0] = types[0].type.name;
        }
        else if(types.length == 2){
            type[0] = types[1].type.name;
            type[1] = types[0].type.name;
        }
        else{
            alert('Pokemon type error');
        }
        return type;
    }
    //API: move;
    this.GetMove = $resource('http://pokeapi.co/api/v2/move/:moveId', {}, {
        get: {

        }
    });
    //GET: Get 4 random moves for a pokemon;
    this.getMoves = function(pokemon, callback){
        pokemon.movesUsed = [];
        for (var i = 0; i < 4; i++){
            that.GetMove.get({moveId : pokemon.moves[that.randomInt(pokemon.moves.length-1)].move.name}, function(index) {
                return function(data) {
                    pokemon.movesUsed[index] = {};
                    pokemon.movesUsed[index].name = data.name;
                    pokemon.movesUsed[index].type = data.type.name;
                    pokemon.movesUsed[index].power = data.power;
                    pokemon.movesUsed[index].accuracy = data.accuracy;
                    pokemon.movesUsed[index].damageClass = data.damage_class.name;
                    if (index == 3)
                        callback();
                }
            }(i));
        }
    }
    // GET: For all Pokémon names in team array, gets Pokémon details and passes that into an array teamDetails.
    // Special function in a function passing in key as index, called directly, ensuring the key gets updated from 0 to team.length-1.
    this.writeTeamDetails = function() {
        isLoading = true;
        for (var key in team) {
            var pokemonName = team[key]/*.name*/;
            that.GetPokemon.get({pokemonNameOrId: pokemonName} , function(index) {
                return function(data) {
                    teamDetails[index] = data;
                    //teamDetails[index].level = null;
                    teamDetails[index].battleStats = that.calcStats(data);
                    teamDetails[index].type = that.restructureTypes(data.types);
                    that.getMoves(teamDetails[index], function(){
                        if (teamDetails[index].movesUsed[3].damageClass && teamDetails[3].type[0]){
                            isLoading = false;
                            console.log(teamDetails[index]);
                        }
                    });
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

    this.getOppDetails = function() {
        return opponentDetails;
    }

    //Adds pokemon to selected team;
    this.addToTeam = function(pokemonName) {
        team.push(pokemonName);
    }
    //Returns the selected team;
    this.getTeam = function() {
        return team;
    }
    //GET: Get a random opponent;
    this.getRandomOpponent = function() {
        isLoading = true;
        var randomNum = Math.floor(Math.random() * 150) + 1;
        this.GetPokemon.get({pokemonNameOrId: randomNum}, function(data) {
            opponentDetails = {};
            console.log('opp');
            opponentDetails = data;
            opponentDetails.battleStats = that.calcStats(data);
            opponentDetails.type = that.restructureTypes(data.types);
            that.getMoves(opponentDetails, function(){
                if (opponentDetails.movesUsed[3].damageClass && opponentDetails.type[0]){
                    isLoading = false;
                    console.log(opponentDetails);
                }
            });
        }, function(error) {
            console.log(error);
        })
    }

    /************ Battle damages **********/
    /************ If a pokemon do not have type2, pass a 'undefined' or false **********/

    //If the move is on target (true) or miss (false);
    this.isOnTarget = function(accuracy) {
        return accuracy ? (that.randomInt(100-1) < accuracy) : true;
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
        return effectivenessMatrix[types.indexOf(moveType)][types.indexOf(oppType1)] * (oppType2 ? effectivenessMatrix[types.indexOf(moveType)][types.indexOf(oppType2)] : 1);
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
        //Use status as special;
        else if(move.damageClass == 'special' || move.damageClass == 'status'){
            atk = pokemon.spAttack;
            def = oppPokemon.spDefense;
        }
        else {
            alert('Damage class error');
        }
        var effectiveness = that.getEffectiveness(move.type, oppPokemon.type[0], oppPokemon.type[1]);
        var stab = that.getSTAB(move.type, pokemon.type[0], pokemon.type[1]);
        var level = pokemon.level ? pokemon.level : 100;
        return Math.round(((0.4*level+2)*move.power*atk/def/50+2)*effectiveness*stab*(that.randomInt(15)+85)/100);
    }
    //Get the pokemon HP after the damages
    this.poseDamage = function(hp, damage){
        return (hp > damage) ? (hp - damage) : 0;
    }
    //If the pokemon is dying.
    this.isDying = function(pokemon) {
        return pokemon.HP == 0;
    }
    //Perform the attack, callbacks the effectiveness category and if it is dying; or the miss status;
    this.performMove = function(pokemon, oppPokemon, move, callbackHit, callbackMiss){
        if(that.isOnTarget()){
            //On target;
            oppPokemon.HP = that.poseDamage(oppPokemon.HP, that.getDamage(move, pokemon, oppPokemon));

            callbackHit(that.tellEffectiveness(that.getEffectiveness(move.type, oppPokemon.type[0], oppPokemon.type[1])), that.isDying(oppPokemon));
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
