var Dice = Component.createComponent(function () {
    var e = VDOM.createElement;
    return e('div', {className: 'dice dice${state.value}', style:'background-color: ${props.color};', onClick: this.shake}, '');
});
Dice.prototype.roll = function () {
    this.setState({value: parseInt(Math.random() * 6, 10) + 1});
};
Dice.prototype.shake = function () {
    this.speed = 1000;
    this.shakeNext();
};
Dice.prototype.shakeNext = function () {
    this.roll();
    if (this.speed >= 10) {
        setTimeout(this.shakeNext.bind(this), 220 - this.speed * 2);
        this.speed *= .75;
    }
};
Dice.prototype.willMount = function () {
    console.log('dice that will mount');
    this.setState({value: this.props.initialValue});
};
