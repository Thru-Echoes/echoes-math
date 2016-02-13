/**
 * @fileOverview Enhanced debug functions.
 * @author <a href="mailto:omuellerklein@berkeley.edu">Oliver Muellerklein</a>
*/

/**
 * Enhanced type check for TypeError catch / exceptions.
 *
 * @param {object} obj - object for type checking.
 *
 * @returns {string} - Returns string of obj type
*/
var isType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * Enhanced type check for TypeError catch / exceptions.
 *
 * @param {boolean} isDebug - true or false.
 * @param {object} theScope - class / object we are working in (e.g. this).
 *
 * @returns {string} - Returns enhanced debugger function.
*/
var xDebug = function(isDebug, theScope) {
    this.debug = {};

    if (isDebug && theScope.isDebug) {
        for (var m in console) {
            if (typeof console[m] == 'function') {
                this.debug[m] = console[m].bind(window.console, theScope.toString() + ": ");
            }
        }
    } else {
        for (var n in console) {
            if (typeof console[n] == 'function') {
                this.debug[n] = function () {};
            }
        }
    }
    return this.debug;
};

/**
 * Enhanced debugger tool.
 * @example
 * var isDebug = true;
 * var debug = xDebug(isDebug, this);
 * debug.log("Hello log");
 * debug.trace("Hello trace");
 * @returns {string} - Returns enhanced debugger function.
*/
