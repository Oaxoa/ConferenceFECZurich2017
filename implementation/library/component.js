/**
 * Component base consturctor function
 * @param {object} props
 * @constructor
 */
function Component(props) {
    this.props = props;
    this.state = {};
}
/**
 * Sets the internal state of the instance and asks for a rerender
 * @param {*} state
 */
Component.prototype.setState = function (state) {
    if (state !== this.state) {
        this.state = state;
        Reconciler.enqueueRender(this);
    }
};

// Abstract
Component.prototype.render = function () {};
Component.prototype.willMount = function () {};
Component.prototype.didMount = function () {};
Component.prototype.willUnmount = function () {};

/**
 * Creates a custom component constructor function
 * @param {function} render
 * @returns {function}
 */
Component.createComponent = function (render) {
    var f = function (props) {
        Component.call(this, props);
    };
    f.prototype = Object.create(Component.prototype);
    f.prototype.constructor = f;

    if (render === undefined) throw 'Render function is required';
    f.prototype.render = render;

    return f;
};