var Reconciler = (function () {
    var items = [];

    /**
     * Renders a vdom object
     * @param {VDOMObject} vdom
     * @param {HTMLElement} parentElement
     */
    var renderVDOM = function (vdom, parentElement) {
        var dom;
        if (parentElement.childNodes.length) dom = parentElement.childNodes[0];
        reconcileTree(dom, vdom, null, parentElement);
    };


    /**
     * Adds a component that needs update to the render queue. No real functionality here, just a basic stub
     * @param {Component} component
     */
    var enqueueRender = function (component) {
        component.dirty = true;
        items.push(component);

        rerender();
    };

    /**
     * Rerenders the whole queue (just a super simplified stub, no instances recollecting, no debouncing etc.)
     */
    var rerender = function () {
        var p;
        while (p = items.pop()) {
            if (p.dirty) {
                renderComponent(p, p.parentElement);
            }
        }
    };

    /**
     * Renders a component into the parent element
     * @param {Component} component
     * @param {HTMLElement} parentElement
     */
    var renderComponent = function (component, parentElement) {
        if (parentElement) {
            if (!component.mounted) {
                component.willMount();
            }
            var vdom = component.render();
            component.vdom = vdom;

            var dom;
            if (component.dom) dom = component.dom;
            component.parentElement = parentElement;
            reconcileTree(dom, vdom, component, parentElement);

            if (!component.mounted) {
                component.didMount();
                component.mounted = true;
            }
        }
    };


    /**
     * Removes the component and call willUnmount when a subtree is discarded
     * @param {Component} component
     */
    var removeComponent = function (component) {
        component.target.removeChild(component.dom);
        component.mounted = false;
        component.willUnmount();
    };


    /**
     * Renders the actual DOM in memory and returns it. Recursive
     *
     * @param {VDOMObject} vdomObj
     * @param {Component} component
     * @param {Array} customEvents
     * @returns {HTMLElement}
     */
    var renderDOM = function (vdomObj, component, customEvents) {
        component = component || vdomObj.instance || null;
        var el = document.createElement(vdomObj.type);
        // save a reference to the component instance to access props
        el.component = component;

        if (vdomObj.attributes) {
            for (var attributeName in vdomObj.attributes) {
                var attributeRealName = attributeName;
                if (attributeName === 'className') attributeRealName = 'class';

                var attributeValue = vdomObj.attributes[attributeName];
                if (typeof attributeValue === 'string') {
                    var parsedAttributeValue;
                    if (component) {
                        parsedAttributeValue = Utils.parseInlineTemplating(attributeValue, component)
                    } else {
                        parsedAttributeValue = attributeValue;
                    }
                    el.setAttribute(attributeRealName, parsedAttributeValue);
                }
            }
        }
        if (customEvents) {
            customEvents.forEach(function (customEventObj) {
                el.addEventListener(customEventObj.name, customEventObj.value.bind(component));
            });
        }

        vdomObj.children.forEach(function (child) {
            if (typeof child === 'object') {
                var targetComponent = child.instance || component;
                var customEvents = getCustomEvents(child);
                if (child.instance) {
                    // is a component, render it
                    renderComponent(child.instance, el)
                } else {
                    // it is a simple vdom
                    el.appendChild(renderDOM(child, targetComponent, customEvents));
                }

            } else {
                el.textContent += Utils.parseInlineTemplating(child, component);
            }
        });
        return el;
    };

    /**
     * Given an existing dom and a vdom reconcile the differences
     * @param {HTMLElement} dom
     * @param {VDOMObject} vdom
     * @param {Component} component
     * @param {HTMLElement} parentElement
     */
    var reconcileTree = function (dom, vdom, component, parentElement) {
        var customEvents = getCustomEvents(vdom);
        var newDom = renderDOM(vdom, component, customEvents);

        // if dom is not defined check if parentElement already has a child and use that
        if (!dom) {
            if (parentElement.childNodes && parentElement.childNodes.length) {
                dom = parentElement.childNodes[0];
            }
        }

        // otherwise keep going
        if (!dom) {
            // render the whole thing
            if (component) component.dom = newDom;

            parentElement.innerHTML = '';
            parentElement.append(newDom);
        } else {
            // compute diff
            if (dom.nodeName !== newDom.nodeName) {
                // different type, discard all subtree
                // TODO add removal of sub components so that they fire willUnmount/didUnmount hook
                reconcileTree(null, vdom, component, parentElement);
            } else {
                // same type, check attributes

                // convert NamedNodeMap(s) in a map object
                var oldAttributesMap = getAttributesObject(dom.attributes);
                var newAttributesMap = getAttributesObject(newDom.attributes);

                // check for attributes and events to be added or changed
                for (var attributeName in newAttributesMap) {
                    if (!oldAttributesMap.hasOwnProperty(attributeName) || oldAttributesMap[attributeName] !== newAttributesMap[attributeName]) {
                        // set a new attribute / event listener
                        var standardEventName = Utils.getStandardEventName(attributeName);
                        if (standardEventName) {
                            // a custom event. Add the listener
                            dom.addEventListener(standardEventName, newAttributesMap[attributeName]);
                        } else {
                            // just a regular attribute
                            dom.setAttribute(attributeName, newAttributesMap[attributeName]);
                        }
                    }
                }
                // check attributes and events to be removed
                for (var attributeName in oldAttributesMap) {
                    if (oldAttributesMap.hasOwnProperty(attributeName) && !newAttributesMap.hasOwnProperty(attributeName)) {
                        // remove attribute / event listener
                        var standardEventName = Utils.getStandardEventName(attributeName);
                        if (standardEventName) {
                            dom.removeEventListener(standardEventName);
                        } else {
                            // just a regular attribute
                            dom.removeAttribute(attributeName);
                        }
                    }
                }

                // check subtree
                for (var i = 0; i < newDom.childNodes.length; i++) {
                    var newChildNode = newDom.childNodes[i];
                    var childNode = dom.childNodes[i];

                    if (newChildNode.nodeType === 3) {
                        if (childNode.nodeValue !== newChildNode.nodeValue) {
                            childNode.nodeValue = newChildNode.nodeValue;
                        }
                    } else {
                        var vdomChild = vdom.children[i];
                        reconcileTree(childNode, vdomChild, vdomChild.instance || component, dom);
                    }
                }
            }
        }
    };

    /**
     *
     * @param {VDOMObject} vdom
     * @returns {Object[]}
     */
    var getCustomEvents = function (vdom) {
        var out = [];
        for (var prop in vdom.attributes) {
            var standardEvent = Utils.getStandardEventName(prop);
            if (standardEvent) out.push({name: standardEvent, value: vdom.attributes[prop]});
        }
        return out;
    };

    /**
     * Given a NamedNodeMap of the attributes returns a map object
     * @param {NamedNodeMap} attributesObject
     * @returns {object}
     */
    var getAttributesObject = function (attributesObject) {
        var propIndex;
        var out = {};
        for (propIndex in attributesObject) {
            if (attributesObject[propIndex].nodeName) {
                out[attributesObject[propIndex].nodeName] = attributesObject[propIndex].nodeValue;
            } else {
                //debugger;
            }
        }
        return out;
    };

    // PUBLIC API
    return {
        renderComponent: renderComponent,
        renderVDOM: renderVDOM,

        enqueueRender: enqueueRender,
        renderDOM: renderDOM
    };
})();
