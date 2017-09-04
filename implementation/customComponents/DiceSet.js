var DiceSet = Component.createComponent(function () {
    var e = VDOM.createElement;
    return e('div', {className: 'diceSetWrapper'},
        e('h1', {}, '${props.title}'),
        e('div', {className: 'diceWrapper'}, e(Dice, {color: 'white', initialValue: 1})),
        e('div', {className: 'diceWrapper'}, e(Dice, {color: 'gold', initialValue: 2})),
        e('div', {className: 'diceWrapper'}, e(Dice, {color: 'cyan', initialValue: 3}))
    );
});