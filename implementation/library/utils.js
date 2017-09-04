var Utils = (function () {

    var REGEXP_TEMPLATING = /\$\{([^\}]+)\}/g;
    var REGEXP_EVENT = /^on([A-Z][a-zA-Z]*)$/;

    /**
     * Given a string representing a path (i.e.: 'data.price.currency')
     * and a target object, returns the value of targetObj.data.price.currency
     *
     * @param {string} string The string representing the path
     * @param {object} obj The target object
     * @returns {*}
     */
    var getPropertyByString = function (string, obj) {
        var a = string.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in obj) {
                obj = obj[k];
            } else {
                return;
            }
        }
        return obj;
    };
    /**
     * Given a string finds matches for the ${...} pattern and replace them with the content of
     * the corresponding state or prop
     * @param string
     * @param {Component} componentInstance
     * @returns {string}
     */
    var parseInlineTemplating = function (string, componentInstance) {
        return string.replace(REGEXP_TEMPLATING, function (match, group) {
            return Utils.getPropertyByString(group, componentInstance);
        });
    };

    /**
     * Returns an array of the values that are not described in the function signature
     * enabling a usage similar to the... (rest/spread) operator
     * @param {object} argumentsObject
     */
    var getRest = function (argumentsObject) {
        return Array.prototype.filter.call(argumentsObject, function (arg, index) {
            // getting the length property of a function it returns the expected number of params that are described in the signature
            if (index >= argumentsObject.callee.length) return arg;
        });
    };

    /**
     * Given a custom event name (i.e.: onClick) returns the standard event name (i.e.: click) or undefined
     * @param {string} attribute
     * @returns {string|undefined}
     */
    var getStandardEventName = function (attribute) {
        var match = attribute.match(REGEXP_EVENT);
        if (match) {
            return match[1].toLowerCase();
        } else {
            return undefined;
        }
    };

    return {
        getPropertyByString: getPropertyByString,
        parseInlineTemplating: parseInlineTemplating,
        getRest: getRest,
        getStandardEventName: getStandardEventName
    }
})();
