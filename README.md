# PokeBattle
DH2642 Interaction Programing and Dynamic Web - Project - HTML & Javascript
=================================================

[Course website](https://www.kth.se/social/course/DH2641).

Authors:
    Beichen CHEN (beichen@kth.se)
    Hao LI (hao4@kth.se)
    Jingjing XIE (jxi@kth.se)
    Jinwei LIN (jinwei@kth.se)

Brief:
    A Pokemon battle game which users may choose their favourite Pokemons to fight against AIs.
    Possible views: homepage, PM choice, battle, results, highscore

Useful info:
    API: https://pokeapi.co/docsv2/
    Statics: http://bulbapedia.bulbagarden.net/wiki/Statistic
    Damage: http://bulbapedia.bulbagarden.net/wiki/Damage
    PNGs: http://www.pokestadium.com/assets/img/sprites/official-art/large/gengar.png <-- modifiable

Data needed:
    Pokedex,
    Pokemon: id, name, type, base stats (health points, attack, defense, special attack, special defense), IV (0-31), skills (power, PP, type, normal/special, accuracy, effects),

Battle flow: 就先用中文写了，因为英文名词还不很懂，仅根据个人回忆，有出入请指正

    队首精灵出战

    *异常状态判断
    *精灵特性效果
    *所持有道具
    *天气
    行动
        技能使用
            ##行动阶段
            判断是否有前续技能（如【飞空术】等多回合技）
            选择技能
            *PP检查
            *自身异常状态判断（如沉睡、颓废使不能释放技能）
            *精灵特性效果判断（如【潮气】使得【自爆】技能无法释放）
            ##作用阶段
            *自身异常状态判断（如麻痹、混乱等影响释放技能）
            技能优先度判断
            *打击面判断
            命中判断（命中率）
            属性相克判断（如Ground技能不能对Flying精灵造成伤害）
            *精灵特性效果判断（如飘浮特性精灵，如Haunter不能被Ground技能伤害）
            伤害计算 @公式
            判断是否濒死（是-->更换精灵页）
            *异常状态触发
            *技能效果触发（buff，debuff，天气，逃跑，使逃跑等）
            *接触判断
            *精灵特性效果判断（如【静电】特效使接触攻击者被麻痹）
            *持有道具效果触发判断（是-->触发）
        *道具使用
            *道具选择
            *道具作用判断
            *道具效果触发（不清楚这里的优先度计算）
        更换精灵
            *判断是否能够进行更换（如【踩影】特性）
            判断是否有技能触发（如【追击】）
            精灵更换（不清楚这里的优先度计算）
        回合结束
    胜利/失败
