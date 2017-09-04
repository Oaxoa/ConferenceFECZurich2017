# A handmade VirtualDOM and diff rendering implementation
### aka "A handmade (simplified) React-like library implementation in ~250 lines of plain ECMAScript5"

![](cover.jpg)

This is the repository of the material releted to the public talk given at the <FEC /> Front end conference Zurich 2017 by Pierluigi Pesenti.

You can watch the [entire video of the talk](https://vimeo.com/232250447) for free.

Included in this repo you will find:

1. the implementation
2. the tests
3. the presentation and relative assets (please beware it could contain parts of copyrighted pictures not suitable for commercial use)


> ### Please note:
> the implementation was created by me in a short amount of time and is intended to be for **EXPLAINING and TEACHING PURPOSES ONLY** and it is **NOT production ready** nor is intended to be used in any real project or to be to any extent compatible with React.js.

It contains a few know bugs:

- Reconciliation implementation is not complete (i.e.: removeComponent is never called so willUnmount is never fired, etc.). I will try to complete it asap. Please feel free to send a pull request if you would like to step in and give some help.
- When using a sub component you have to wrap it in at least one VDOM parent element:

```javascript
WrappedComponent = Component.createComponent(function () {
    return e('div', {}, e(
        NestedComponent, {label: 'ciao people', color: 'red'}
    ));
});
```
using
```javascript
WrappedComponent = Component.createComponent(function () {
    return e(NestedComponent, {label: 'ciao people', color: 'red'});
});
```
would create issues with the management of events.

- events are managed by extracting attributes that match a regexp pattern "onClick, onMousedown, onWhatever..." (/^on([A-Z][a-zA-Z]*)$/) which is fun and fast but could be not as accurate as mantaining a complete list of custom event names mapped to standard event names.
- various other issues

