// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
pokeBattleApp.factory('PokeModel',function ($resource, $firebaseObject, $cookieStore) {
    var that = this;
    //For loading widget;
    var teamIsLoading = false;
    var oppIsLoading = false;
    // var isLoading = false;
    //1-721; 10001-10090;
    var pokemonAllName = [];
    var showContinue = false;

    this.GetPokedex = $resource('http://pokeapi.co/api/v2/pokedex/:index', {}, {
        get: {

        }
    });
    this.GetPokedex.get({index: 1}, function(data){
        for (key in data.pokemon_entries){
            pokemonAllName.push(data.pokemon_entries[key].pokemon_species.name);
            //isLoading = false;
        }
    });
    // var pokemonAllId = [];
    // for (i = 1; i <= 721; i++){
    //     pokemonAllId.push(i);
    // }
    // for (i = 10001; i <= 10090; i++){
    //     pokemonAllId.push(i);
    // }

    // username
    var username = "";
    //Team in pokemon name;
    var team = [];
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

    var score = 0;

    //API calls
    //API: pokemon;
    this.GetPokemon = $resource('http://pokeapi.co/api/v2/pokemon/:pokemonNameOrId', {}, {
        get: {

        }
    });

    this.getShowContinue = function() {
      return showContinue;
    }

    this.setShowContinue = function(bool) {
      showContinue = bool;
    }

    //GET: pokemon for choosing;
    this.getAllPokemon = function(callback, errorCallback) {
        //isLoading = true;
        this.GetPokemon.get({offset: offset}, function(data) {
            offset += 20;
            console.log(offset);
            //isLoading = false;
            callback(data);
        }, function(error) {
            errorCallback(error);
        })
    }
    //GET: Get pokemon for searching;
    this.getPokemon = function(pokemonNameOrId, callback, errorCallback) {
        //isLoading = true;
        this.GetPokemon.get({pokemonNameOrId: pokemonNameOrId}, function(data) {
            //isLoading = false;
            callback(data);
        }, function(error) {
            errorCallback(error);
        })
    }


    this.GetPokeByType = $resource('http://pokeapi.co/api/v2/type/:typeId', {}, {
        get: {

        }
    })

    this.setUsername = function(usernameToSet) {
        username = usernameToSet;
        console.log(username);

    }

    this.getUsername = function() {
        return username;
    }

    this.increaseScore = function() {
        score += 1;
    }

    this.getScore = function() {
        return score;
    }

    this.setScore = function(scoreToSet) {
        score = scoreToSet;
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
        statsUsed.speed =     Math.round((pokemon.stats[0].base_stat + spIV ) * 2 * level / 100 + 5);
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

    // Checks the moves array for duplicate moves and replaces them
    // this.checkDuplicates = function(randomMoveIds, pokemon) {
    //     var duplicateExists = true;
    //     while (duplicateExists) {
    //         console.log("enter while");
    //         for (var i = 0; i < randomMoveIds.length; i++) {
    //             var firstMoveId = randomMoveIds[i];
    //             for (var j = 0; j < randomMoveIds.length; j++) {
    //                 if (j != i) {
    //                     var secondMoveId = randomMoveIds[j];
    //                     if (firstMoveId == secondMoveId) {
    //                         // Reassigning new random number as move id
    //                         randomMoveIds[i] = that.randomInt(pokemon.moves.length-1);
    //                     } else {
    //                         console.log("not same");
    //                         if (j == randomMoveIds.length-2 && i == randomMoveIds.length-1) {
    //                             console.log("compared all");
    //                             console.log(randomMoveIds);
    //                             // Have compared all moves
    //                             duplicateExists = false;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //     return randomMoveIds;
    // }
    //GET: Get 4 random moves for a pokemon;
    this.getMoves = function(pokemon, callback, errorCallback){
        pokemon.movesUsed = [];

        if(pokemon.name !== 'ditto'){
            console.log(pokemon.name);
            // randomMoveIds = that.checkDuplicates(randomMoveIds, pokemon);
            var movesTemp = [];
            movesTemp = pokemon.moves;
            var randomMoves = [];
            for (var i = 0; i < 4; i++) {
                var randomNum = that.randomInt(pokemon.moves.length-1);
                randomMoves.push(movesTemp[randomNum].move.name);
                movesTemp.splice(randomNum, 1);
            }
            var moveIntegrity = 0;
            for (var i = 0; i < 4; i++){
                var moveNameTemp = randomMoves[i];
                that.GetMove.get({moveId : moveNameTemp}, function(index) {
                    return function(data) {
                        pokemon.movesUsed[index] = {};
                        pokemon.movesUsed[index].name = data.name;
                        pokemon.movesUsed[index].type = data.type.name;
                        pokemon.movesUsed[index].power = data.power;
                        pokemon.movesUsed[index].accuracy = data.accuracy;
                        pokemon.movesUsed[index].damageClass = data.damage_class.name;
                        moveIntegrity++;
                        if (moveIntegrity == 4)
                        callback();
                    }
                }(i), function(error) {
                    console.log(error);
                    errorCallback(error)
                });
            }
        }
        else {
            console.log('ditto' + pokemon.name);
            //Give Ditto 4 random moves other than transform.
            var moveSet = [];
            for (i = 1; i <= 621; i++){
                moveSet.push(i);
            }
            moveSet.splice(143, 1);
            for (var j = 0; j < 4; j++){
                var randomMoveId = that.randomInt(moveSet.length-1);
                var moveId = moveSet[randomMoveId];
                moveSet.splice(randomMoveId, 1);
                console.log('moveID' + moveId);
                that.GetMove.get({moveId : moveId}, function(index) {
                    return function(data) {
                        console.log(index + data.name);
                        pokemon.movesUsed[index] = {};
                        pokemon.movesUsed[index].name = data.name;
                        pokemon.movesUsed[index].type = data.type.name;
                        pokemon.movesUsed[index].power = data.power;
                        pokemon.movesUsed[index].accuracy = data.accuracy;
                        pokemon.movesUsed[index].damageClass = data.damage_class.name;
                        if (index == 3)
                        callback();
                    }
                }(j), function(error) {
                    console.log(error);
                    errorCallback(error)
                });
            }
        }
    }
    // GET: For all Pokémon names in team array, gets Pokémon details and passes that into an array teamDetails.
    // Special function in a function passing in key as index, called directly, ensuring the key gets updated from 0 to team.length-1.
    this.writeTeamDetails = function(callbackTeam, errorCallback) {
        //isLoading = true;
        for (var key in team) {
            var pokemonName = team[key]/*.name*/;
            that.GetPokemon.get({pokemonNameOrId: pokemonName} , function(index) {
                return function(data) {
                    teamDetails[index] = data;
                    //teamDetails[index].level = null;
                    teamDetails[index].battleStats = that.calcStats(data);

                    teamDetails[index].type = that.restructureTypes(data.types);
                    that.getMoves(teamDetails[index], function(){
                        console.log(teamDetails[index]);

                        var countFinished = 0;
                        for (var i = 0; i < 4; i++) {
                            if (teamDetails[i].movesUsed.length === 4){
                                countFinished++;
                            }
                        }
                        if (countFinished == 4) {
                            console.log("hello");
                            // teamIsLoading = false;
                            // if(oppIsLoading == false) {
                            //     isLoading = false;
                            // }
                            callbackTeam();
                        }
                    }, function(error) {
                        //console.log("error with getting moves");
                        errorCallback(error);
                    });
                }
            }(key), function (error) {
                //console.log("error with getting pokemon");
                errorCallback(error);
            })
        }
    }

    this.setTeamDetails = function(detailsToSet) {
        teamDetails = detailsToSet;
    }

    //Returns the team details;
    this.getTeamDetails = function() {
        return teamDetails;
    }
    //Random a team;
    this.getRandomTeam = function() {
        var allName = pokemonAllName.slice(0);
        console.log(allName);
        team = [];
        for (i = 0; i < 4; i++){
            var randomTemp = that.randomInt(allName.length-1);
            team[i] = allName[randomTemp];
            allName.splice(randomTemp, 1);
        }
    }
    this.swapTwoPokemon = function(index1, index2) {
        var temp = team[index1];
        team[index1] = team[index2];
        team[index2] = temp;
    }

    this.getOppDetails = function() {
        return opponentDetails;
    }

    this.setOppDetails = function(detailsToSet) {
        opponentDetails = detailsToSet;
    }

    this.addToTeam = function(pokemonName) {
        team.push(pokemonName);
    }

    this.deleteFromTeam = function(pokemonName) {
        for(key in team){
            if(pokemonName == team[key]){
                team.splice(key,1);
                break;
            }
        }
    }

    this.getIsInTeam = function(pokemonName){
        for(var i = 0; i < team.length; ++i) {
            if(pokemonName == team[i]) {
                return true;
            }
        }
        return false;
    }
    //Returns the selected team;
    this.getTeam = function() {
        return team;
    }

    //GET: Get a random opponent;
    this.getRandomOpponent = function(callback, errorCallback) {
        //isLoading = true;
        var randomNum = that.randomInt(720)+1;
        this.GetPokemon.get({pokemonNameOrId: randomNum}, function(data) {
            opponentDetails = {};
            console.log('opp');
            opponentDetails = data;
            opponentDetails.battleStats = that.calcStats(data);
            opponentDetails.type = that.restructureTypes(data.types);
            that.getMoves(opponentDetails, function() {
                if (opponentDetails.movesUsed.length === 4) {
                    // oppIsLoading = false;
                    // if (teamIsLoading == false) {
                    //     isLoading = false;
                    // }
                    if (callback !== undefined) {
                        callback();
                    }
                    console.log(opponentDetails);
                }
            }, function(error) {
                errorCallback(error);
            });
        }, function(error) {
            console.log("getRandomOpponent error");
            console.log(error);
        })
    }

    // Gets all details needed for battle. Callback when both writeTeamDetails and getRandomOpponent are finished.
    this.getAllDetails = function(callback, errorCallback) {
        this.writeTeamDetails(function() {
            that.getRandomOpponent(function() {
                callback();
            }, function(error) {
                errorCallback(error);
            })
        }, function(error) {
            errorCallback(error);
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
        var types = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
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

        var eff1 = effectivenessMatrix[types.indexOf(moveType)][types.indexOf(oppType1)];

        var eff2 = oppType2 ? effectivenessMatrix[types.indexOf(moveType)][types.indexOf(oppType2)] : 1;

        return eff1 * eff2;
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
            atk = pokemon.battleStats.attack;
            def = oppPokemon.battleStats.defense;
        }
        //Use status as special;
        else if(move.damageClass == 'special' || move.damageClass == 'status'){
            atk = pokemon.battleStats.spAttack;
            def = oppPokemon.battleStats.spDefense;
        }
        else {
            alert('Damage class error');
        }

        var effectiveness = that.getEffectiveness(move.type, oppPokemon.type[0], oppPokemon.type[1]);

        var stab = that.getSTAB(move.type, pokemon.type[0], pokemon.type[1]);

        var level = pokemon.level ? pokemon.level : 100;
        var damage = Math.round(((0.4 * level + 2) * move.power * atk / def / 50 + 2) * effectiveness * stab * (that.randomInt(15)+85)/100);
        console.log(damage);
        // Happens when power is null, then the key "power" won't even get updated to Firebase so accessing power will give nothing and damage is NaN.
        if (damage == undefined || isNaN(damage)) {
            return 10 * stab * effectiveness; //Give a lower damage to non-damage moves.
        } else {
            return damage;
        }
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
            oppPokemon.battleStats.HP = that.poseDamage(oppPokemon.battleStats.HP, that.getDamage(move, pokemon, oppPokemon));
            callbackHit(that.tellEffectiveness(that.getEffectiveness(move.type, oppPokemon.type[0], oppPokemon.type[1])), that.isDying(oppPokemon));
        }
        else{
            //Missed;
            callbackMiss('The attack missed.');
        }
        return true;
    }

    this.changePokemon = function(index) {
        var temp = teamDetails[0];
        teamDetails[0] = teamDetails[index];
        teamDetails[index] = temp;
    }

    /************ Firebase **********/

    // Loads gamedata for the username from Firebase. If game data exists, set model details to Firebase data.
    // If game data does not exist, call APIs and set model details to API data.
    this.loadFirebaseData = function(callback, errorCallback) {
        if (username !== "") {
            var battleDataRef = firebase.database().ref('/gameData/'+username+'/');
            var battleDataObj = $firebaseObject(battleDataRef);

            battleDataObj.$loaded().then(function() {
                if (battleDataObj.teamDetails == undefined || battleDataObj.teamDetails == null) {

                    that.setScore(0);

                    that.getAllDetails(function() {
                        battleDataRef.child("teamDetails").set(angular.fromJson(angular.toJson(teamDetails)));
                        battleDataRef.child("oppDetails").set(angular.fromJson(angular.toJson(opponentDetails)));
                        battleDataRef.child("score").set(angular.fromJson(angular.toJson(score)));
                        battleDataRef.child("currentMenu").set("main");
                        callback(false, battleDataObj);
                    }, function(error) {
                        errorCallback(error);
                    })

                } else {
                    that.setTeamDetails(battleDataObj.teamDetails);
                    that.setOppDetails(battleDataObj.oppDetails);
                    that.setScore(battleDataObj.score);

                    callback(true, battleDataObj);
                }
            })
        } else {
          errorCallback("Error: No data for that username. You are probably not logged in. Please go to the homepage and log in or sign up.");
        }
    }

    // Resets game messages in Firebase
    this.resetFirebaseMessages = function() {
        var battleDataRef = firebase.database().ref('/gameData/'+username+'/');
        battleDataRef.child("changeMsg").remove();
        battleDataRef.child("attackMsg").remove();
        battleDataRef.child("damageMsg").remove();
        battleDataRef.child("faintedMsg").remove();
        battleDataRef.child("effectivenessMsg").remove();
        battleDataRef.child("promptMsg").remove();
    }

    this.removeGameData = function() {
        var battleDataRef = firebase.database().ref('/gameData/'+username+'/');
        battleDataRef.remove();
    }

    // Updates values to Firebase
    this.updateToFirebase = function(child, value) {
        var battleDataRef = firebase.database().ref('/gameData/'+username+'/');
        battleDataRef.child(child).set(value);
    }

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
