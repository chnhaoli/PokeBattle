# [PokéBattle](http://obscure-oasis-61451.herokuapp.com/)
Final Project @[DH2642 Interaction Programing and Dynamic Web](https://www.kth.se/social/course/DH2642/)

=================================================

##See [Heroku deployment](http://obscure-oasis-61451.herokuapp.com/)

###Authors:

    Beichen CHEN (beichen@kth.se)
    Hao LI (hao4@kth.se)
    Jingjing XIE (jxi@kth.se)
    Jinwei LIN (jinwei@kth.se)

###Brief:

    A Pokémon battle game which users may choose their favourite Pokémons to fight against AIs.

###Technologies:
1. HTML5
2. CSS3
3. [Bootstrap](http://getbootstrap.com/)
4. Javascript
5. [AngularJS](https://angularjs.org/)
6. [Firebase](https://firebase.google.com/)
7. [Heroku](https://www.heroku.com/platform)

###Views:
    homepage, choose team, battle, FAQ, highscore

###Setup:

1. Get and install node if you do not already have it yet;
2. Get a fresh copy of the [project code](https://github.com/chnhaoli/PokeBattle);
3. Navigate to the project repository in your command line;
4. Run `npm install` which installs the web server and other need components;
5. Run `npm start` which start a local http server on [port:8000](http://localhost:8000/);
6. You should now be able to go to http://localhost:8000/  and see the project running

###Useful info:

1. API: [Pokeapi](https://pokeapi.co/docsv2/)
2. Statics: from [Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/Statistic)
3. Damage: from [Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/Damage)
4. PNGs: from [Pokestadium](http://www.pokestadium.com/tools/sprites)


###Endpoints: data needed (function):

    /type: list of Pokémons whose types is in (search for Pokémons by type)
    /pokemon: name, type, base stats [health points, attack, defense, special attack, special defense)], moves
    /move: power, type, damage class, accuracy

###Instruction:

    0. Go to the homepage:
        0.1 Toggle music;
        0.2 Check FAQ;
        0.3 Check about us.
    1. Authentication:
        1.1 Login;
        1.2 Sign up.
    2. Choose team:
        2.1 Search by type (can randomize);
        2.2 Search by name with selected type;
        2.3 Check Pokémon details;
        2.4 Add to/ remove from team;
        2.5 Change the order of Pokémons (drag and drop);
        2.6 Go to battle.
    3. First Pokémon in the team starts the battle.
    4. Trainer's round:
        4.1. attack (next opponent and +1 score if opponent is fainted);
        4.2. use item ª;
        4.3. change Pokémon;
        4.4. run away ª.
    5. Opponent's round:
        5.1. attack (forced to change Pokémon if trainer's is fainted; game over if all of trainer's are fainted).
    6. Next round, until game over.
    7. Highscores.

    ª marks those which are not implemented.
