QUnit.module('Utils');

var a = {a: {a: 1, b: 'hello'}, b: 2};

QUnit.test('getPropertyByString', function (assert) {
    assert.ok(Utils.getPropertyByString('a.a', a) === 1);
    assert.ok(Utils.getPropertyByString('a.b', a) === 'hello');
    assert.ok(Utils.getPropertyByString('b', a) === 2);
});

QUnit.test('getRest', function (assert) {
    var testFunction = function (a, b) {
        var rest = Utils.getRest(arguments);
        assert.ok(rest.length === 3);
        assert.deepEqual(rest, [3, 4, 5]);
    };
    testFunction(1, 2, 3, 4, 5);

    var testFunction2 = function () {
        var rest = Utils.getRest(arguments);
        assert.ok(rest.length === 2);
        assert.deepEqual(rest, ['Hello', 'world!']);
    };
    testFunction2('Hello', 'world!');
});
QUnit.test('getStandardEventName', function (assert) {
    assert.equal(Utils.getStandardEventName('onClick'), 'click');
    assert.equal(Utils.getStandardEventName('onWhateverEvent'), 'whateverevent');
    assert.equal(Utils.getStandardEventName('onclick'), undefined);
});

QUnit.module('Component');

var testComponents = {};
testComponents.Button1 = Component.createComponent(function () {
    return VDOM.createElement('button', {
        style: 'background: ${props.color};',
        onclick: 'alert(\'yoppa\')'
    }, '${props.label}');
});
var b1 = new testComponents.Button1({label: 'button text'});

QUnit.test('createComponent', function (assert) {
    assert.throws(function () {
        Component.createComponent()
    });

    assert.equal(typeof testComponents.Button1, 'function');
    assert.ok(b1 instanceof testComponents.Button1);
});

QUnit.test('lifecycle methods', function (assert) {
    assert.equal(typeof b1.didMount, 'function');
    assert.equal(typeof b1.willUnmount, 'function');
});

QUnit.test('setState', function (assert) {
    var state1 = {test: 5};
    var state2 = {test: 5};
    b1.setState(state1);
    assert.ok(b1.state === state1);
    b1.setState(state2);
    assert.equal(b1.state, state2);
});


QUnit.module('VDOM');
QUnit.test('createElement', function (assert) {
    var e = VDOM.createElement;
    assert.deepEqual(
        e('div'), {type: 'div', attributes: undefined, children: []}
    );
    assert.deepEqual(
        e('span', {className: 'mainClass'}), {type: 'span', attributes: {className: 'mainClass'}, children: []}
    );
    assert.deepEqual(
        e('h1', {'data-role': 'main'}, 'title text'), {
            type: 'h1',
            attributes: {'data-role': 'main'},
            children: ['title text']
        }
    );
    assert.deepEqual(
        e('h1', {'data-role': 'main', style: 'color: red;'}, 'title text', 'second text child'), {
            type: 'h1',
            attributes: {'data-role': 'main', style: 'color: red;'},
            children: ['title text', 'second text child']
        }
    );
    assert.deepEqual(
        e('h1', {}, e('span', {}, 'span text'), e('strong', {className: 'superStrong'}, e(
            'em', {}, 'strong em text'
        ))), {
            type: 'h1',
            attributes: {},
            children: [
                {type: 'span', attributes: {}, children: ['span text']}, {
                    type: 'strong',
                    attributes: {className: 'superStrong'},
                    children: [
                        {type: 'em', attributes: {}, children: ['strong em text']}
                    ]
                }
            ]
        }
    );

    var testObj = {};
    testObj.SubComponent1 = Component.createComponent(function () {
        return e('div', {className: 'sub1'}, '${props.label}');
    });


    var expected;
    var generated;

    expected = {
        type: 'div',
        attributes: {},
        children: [
            {type: 'div', attributes: {className: 'sub1'}, children: ['${props.label}']}
        ]
    };
    generated = e('div', {}, e(testObj.SubComponent1, {label: 'Sub1 label'}));

    assert.ok(generated.children[0].instance instanceof testObj.SubComponent1);

    // deleting instance reference so that it doesn't have to be described in the test
    delete generated.children[0].instance;
    assert.deepEqual(
        generated, expected
    );

    testObj.SubSubComponent1 = Component.createComponent(function () {
        return e('div', {className: 'subsub1'}, '${props.subsublabel}');
    });

    testObj.SubComponent2 = Component.createComponent(function () {
        return e('div', {className: 'sub2'}, e(testObj.SubSubComponent1, {subsublabel: 'hello'}));
    });

    expected = {
        type: 'div',
        attributes: {},
        children: [{
            type: 'div',
            attributes: {className: 'sub2'},
            children: [
                {type: 'div', attributes: {className: 'subsub1'}, children: ['${props.subsublabel}']}
            ]
        }]
    };
    generated = e('div', {}, e(testObj.SubComponent2));

    // deleting the reference to the sub component instance so that deep comparison is possible
    delete generated.children[0].instance;
    delete generated.children[0].children[0].instance;

    assert.deepEqual(
        generated, expected
    );
});

QUnit.module('Reconciler');
QUnit.test('renderDOM', function (assert) {
    var e = VDOM.createElement;

    var renderedVDOM;
    var renderedDOM;

    var testObj = {};
    testObj.WrappedButton = Component.createComponent(function () {
        return e('div', {className: 'buttonWrapper'}, e(
            testComponents.Button1, {label: 'ciao people', color: 'red'}
        ));
    });

    var w1 = new testObj.WrappedButton({propValue: 0});
    renderedVDOM = w1.render();
    renderedDOM = Reconciler.renderDOM(renderedVDOM, w1);

    assert.equal(
        renderedDOM.outerHTML,
        '<div class="buttonWrapper"><button style="background: red;" onclick="alert(\'yoppa\')">ciao people</button></div>'
    );
});
