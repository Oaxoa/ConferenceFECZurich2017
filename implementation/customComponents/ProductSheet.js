var ProductSheet = Component.createComponent(function () {
    var e = VDOM.createElement;
    return e('div', {className: 'productSheet'},
        e('div', {className: 'productAddBox'},
            e('label', {}, 'Size:'),
            e('select', {},
                e('option', {value: 'M'}, 'Medium'),
                e('option', {value: 'L'}, 'Large'),
                e('option', {value: 'XL'}, 'X-Large')
            ),
            e('button', {className: 'productAdd'}, 'Add to cart')
        ),
        e('div', {className: 'productLeft'},
            e('img', {className: 'productImage', src: '${props.product.image}', alt: '${props.product.name}'}, '')
        ),
        e('div', {className: 'productRight'},
            e('h2', {}, '${props.product.name}'),
            e('h4', {}, '${props.product.brand}'),
            e('div', {className: 'productPrice'}, '${props.product.price}'),
            e('div', {className: 'productDescription'}, '${props.product.description}')
        )
    );
});
ProductSheet.prototype.willMount = function () {
    console.log('ProductSheet that will mount');
};
