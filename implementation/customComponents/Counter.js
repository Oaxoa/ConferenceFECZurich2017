var Counter = Component.createComponent(function () {
    var e = VDOM.createElement;

    return e('div', {className: 'counterWrapper'},
        e('div', {className: 'counterNumber'}, '${state.value}'),
        e('button', {onClick: this.increment}, '+'),
        e('button', {onClick: this.decrement}, '-')
    );
});
Counter.prototype.increment = function () {
    this.setState({value: ++this.value});
};
Counter.prototype.decrement = function () {
    this.setState({value: --this.value});
};
Counter.prototype.willMount = function () {
    console.log('Counter that will mount');
    this.value = 0;
    this.setState({value: this.value});
};
