/**
 * @typedef {object} VDOMObject
 * @property {string} type
 * @property {*} attributes
 * @property {*} children
 * @property {Component} [instance] A reference to the instance of the component that gets rendered
 *
 */
var VDOM = (function () {
    var TAGS = ['html', 'base', 'head', 'link', 'meta', 'style', 'title', 'address', 'article', 'aside', 'footer', 'header', 'hgroup', 'nav', 'section', 'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'embed', 'object', 'param', 'source', 'canvas', 'noscript', 'script', 'del', 'ins', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'dialog', 'menu', 'menuitem', 'summary', 'content', 'element', 'shadow', 'slot', 'template', 'acronym', 'applet', 'basefont', 'big', 'blink', 'center', 'command', 'content', 'dir', 'element', 'font', 'frame', 'frameset', 'image', 'isindex', 'keygen', 'listing', 'marquee', 'multicol', 'nextid', 'noembed', 'plaintext', 'shadow', 'spacer', 'strike', 'tt', 'xmp'];
    var dom = {};

    /**
     *
     * @param {string} type
     * @param {*} attributes
     * @returns {VDOMObject}
     */
    var createElement = function (type, attributes) {
        var out;
        var children = Utils.getRest(arguments);
        if (typeof type === 'string') {
            // a simple element
            out = {
                type: type,
                attributes: attributes,
                children: children
            }
        } else {
            // a component. An instance has to be created and the reference saved
            var instance = new type(attributes);
            out = instance.render();
            out.instance = instance;
        }
        return out;
    };

    /**
     * Creates shorthand methods based on html5 tag list via currying
     */
    var createTagMethods = function () {
        TAGS.forEach(function (tag) {
            dom[tag] = function (attributes, children) {
                return createElement(tag, attributes, children);
            }
        });
    };

    createTagMethods();

    return {
        createElement: createElement,
        dom: dom
    }
})();
