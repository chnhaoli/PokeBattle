# PokeBattle
DH2642 Interaction Programing and Dynamic Web
Final Project - HTML & Javascript

=================================================

[Course website](https://www.kth.se/social/course/DH2641).

Authors:

    Beichen CHEN (beichen@kth.se)
    Hao LI (hao4@kth.se)
    Jingjing XIE (jxi@kth.se)
    Jinwei LIN (jinwei@kth.se)

Brief:

A Pokemon battle game which users may choose their favourite Pokemons to fight against AIs.

Views: homepage, choose team, battle, FAQ, highscore

Setup (Inspired by Filip Kis):

    1. Get and install node (if you do not already have it);
    2. Get the fresh copy of the [project code](https://github.com/chnhaoli/PokeBattle);
    3. Navigate to the project repository in your command line;
    4. Run `npm install` which installs the web server and other need components;
    5. Run `npm start` which start a local http server on [port:8000](http://localhost:8000/);
    6. You should now be able to go to http://localhost:8000/  and see the project running


Useful info:

    1. API: [Pokeapi](https://pokeapi.co/docsv2/)
    2. Statics: from [Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/Statistic)
    3. Damage: from [Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/Damage)
    4. PNGs: from [Pokestadium](http://www.pokestadium.com/tools/sprites)
    5. Backend: [Firebase](https://firebase.google.com/)
        Username: newpokebattle@gmail.com (Please contact team for password.)

Endpoints: data needed (function):

    /type: list of pokemons whose types is in (search for pokemons by type)
    /pokemon: name, type, base stats [health points, attack, defense, special attack, special defense~~, speed~~)], moves
    /move: power, type, damage class, accuracy

Battle flow:

    0. First Pokemon in the team starts the battle.
    1. Trainer's round:
        1.1. attack (next opponent and +1 score if opponent is fainted);
        1.2. use item ª;
        1.3. change pokemon;
        1.4. run away ª.
    2. Opponent's round:
        2.1. attack (forced to change Pokemon if trainer's is fainted; game over if all of trainer's are fainted).
    3. Next round.

    ª marks those which are not implemented yet.
