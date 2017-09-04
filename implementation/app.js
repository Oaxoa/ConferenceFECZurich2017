(function () {
    var e = VDOM.createElement;
    var app = document.querySelector('.app');

    /*
    * INSTRUCTIONS: just uncomment one example at a time and run index.html
    * Example #5 and #11 are incremental. Just uncomment them along with #4 and #10
    */

    // __   _____   ___  __  __
    // \ \ / /   \ / _ \|  \/  |
    //  \ V /| |) | (_) | |\/| |
    //   \_/ |___/ \___/|_|  |_|


    // // Example #1
    // var vdom1 = VDOM.createElement('div', {className:'fancy'}, 'Hello fancy');
    // debugger;


    // // Example #2
    // var div1 = VDOM.dom.div({className:'fancy'}, 'Hello div');
    // debugger;


    // // Example #3
    // var vdom1 = e('div', {className: 'outer'}, e(
    //     'div', {className: 'inner'}, 'Hello inner'
    //     ), e(
    //     'div', {className: 'inner'}, e('span', {}, 'Hello span')
    //     )
    // );
    // debugger;


    // // Example #4
    // var vdom = e('input', {placeholder: 'Hello people'});
    // Reconciler.renderVDOM(vdom, app);
    //
    //
    // // Example #5 (uncomment together with #4)
    // setInterval(function() {
    //    var newVdom=e('input', {placeholder:'placeholder text '+Math.random(), className: Math.random()>.5?'inputField1':'inputField2'});
    //    Reconciler.renderVDOM(newVdom, app);
    // }, 3000);


    // // Example #6
    // setInterval(function() {
    // 	if(Math.random()<.5) {
    // 		Reconciler.renderVDOM(e('div', {className:'testDiv'},
    //             e('div', {}, 'Test '),
    //             e('select', {}, e('option', {}, 'option 1'), e('option', {}, 'option 2')),
    //             e('div', {className: 'testClassName2', id:'id_'+parseInt(Math.random()*100, 10)},
    //                 'First text'
    //             )),
    //             app);
    // 	} else {
    // 		Reconciler.renderVDOM(e('div', {className:'testDiv'},
    //             e('div', {className:'testClassName3'}, 'Test '),
    //             e('select', {}, e('option', {}, 'option 1'), e('option', {}, 'option 2')),
    //             e('div', {className: 'testClassName2', id:'id_'+parseInt(Math.random()*100, 10)},
    //                 'Second text'
    //             )),
    //             app);
    // 	}
    //
    // }, 500);


    //  ___ ___ ___ ___
    // |   \_ _/ __| __|
    // | |) | | (__| _|
    // |___/___\___|___|


    // // Example #7
    // var c1 = new Dice({color:'white', initialValue: parseInt(Math.random()*6, 10)});
    // Reconciler.renderComponent(c1, app);


    // // Example #8
    // var ds1 = new DiceSet({title: 'Ciao'});
    // Reconciler.renderComponent(ds1, app);


    //   ___ ___  _   _ _  _ _____ ___ ___
    //  / __/ _ \| | | | \| |_   _| __| _ \
    // | (_| (_) | |_| | .` | | | | _||   /
    //  \___\___/ \___/|_|\_| |_| |___|_|_\


    // // Example #9
    // var counter = new Counter();
    // Reconciler.renderComponent(counter, app)


    //  ___ ___  ___  ___  _   _  ___ _____   ___ _  _ ___ ___ _____
    // | _ \ _ \/ _ \|   \| | | |/ __|_   _| / __| || | __| __|_   _|
    // |  _/   / (_) | |) | |_| | (__  | |   \__ \ __ | _|| _|  | |
    // |_| |_|_\\___/|___/ \___/ \___| |_|   |___/_||_|___|___| |_|


    // Example #10
    var prodProps1 = {
        product: {
            brand: 'FEC',
            name: 'Fancy dress',
            image: 'assets/fancy1.jpg',
            price: '100$',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec neque lectus, pellentesque et tortor a, eleifend egestas tellus. Maecenas sed justo eget tellus commodo venenatis. Cras ornare lacus nunc, blandit finibus justo ullamcorper quis. Nunc fringilla, lorem quis semper semper, ex mi consectetur odio, at ornare quam ante et tellus. Sed consequat non nunc imperdiet accumsan. Sed vitae est quis lacus ultricies gravida eu non turpis. Morbi pellentesque ut dui eget fermentum. Maecenas egestas arcu lacus, nec gravida purus eleifend ultrices. Nullam ut nunc arcu. Suspendisse pharetra dolor nec egestas fermentum.'
        }
    };

    var ps = new ProductSheet(prodProps1);
    Reconciler.renderComponent(ps, app);


    // Example #11 (uncomment on top of example #10)
    var prodProps2 = {
        product: {
            brand: 'FEC',
            name: 'Even fancyier dress',
            image: 'assets/fancy2.jpg',
            price: '110$',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec neque lectus, pellentesque et tortor a, eleifend egestas tellus. Maecenas sed justo eget tellus commodo venenatis. Cras ornare lacus nunc, blandit finibus justo ullamcorper quis. Nunc fringilla, lorem quis semper semper, ex mi consectetur odio, at ornare quam ante et tellus. Sed consequat non nunc imperdiet accumsan. Sed vitae est quis lacus ultricies gravida eu non turpis. Morbi pellentesque ut dui eget fermentum. Maecenas egestas arcu lacus, nec gravida purus eleifend ultrices. Nullam ut nunc arcu. Suspendisse pharetra dolor nec egestas fermentum.'
        }
    };

    var propsArray = [prodProps1, prodProps2];
    var counter = 0;
    setInterval(function () {
        ps = new ProductSheet(propsArray[counter]);
        Reconciler.renderComponent(ps, app);

        counter++;
        counter = counter % propsArray.length;
    }, 1000);
})();
