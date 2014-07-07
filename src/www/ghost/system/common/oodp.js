/**
 *  ______     __  __     ______     ______     ______
 * /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
 * \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
 * \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
 *  \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
 *
 * CodeProgressive Framework for Node.JS
 *
 * OBJECT ORIENTED AND DESIGN PATTERN FILE
 *
 * This file makes it possible to use interfaces and
 * inheritance in Javascript. Some strictness is nice...
 *
 * The method used in this file is derived from a book called
 * Pro JavaScript Design Patterns by : Ross Harmes and Dustin Diaz
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

/*
 |--------------------------------------------------------------------------
 | "CLASS" EXTEND
 |--------------------------------------------------------------------------
 |
 | This function is used to inherit from a superclass and is used as follows
 |
 |      extend( subClass, superClass );
 |
 */

module.exports.extend = function(subClass, superClass) {

    var F = function() {};

    F.prototype = superClass.prototype;

    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;

    if(superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};



/*
 |--------------------------------------------------------------------------
 | INTERFACE
 |--------------------------------------------------------------------------
 |
 | Here we define an interface containing methods to be used by the "class"
 | implementing it. Usage as follows:
 |
 |    var DynamicMap = new Interface('InterfaceNAme', ['method01', 'method02', 'method03']);
 |
 |
 */

module.exports.Interface = function(name, methods) {

    if(arguments.length !== 2) {
        throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];

    for(var i = 0, len = methods.length; i < len; i++) {

        if(typeof methods[i] !== 'string') {

            throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

/*
 |--------------------------------------------------------------------------
 | INTERFACE ENSURE IMPLEMENTED
 |--------------------------------------------------------------------------
 |
 | Usage as follows:
 |
 |    var DynamicMap = new Interface('DynamicMap', ['centerOnPoint', 'zoom', 'draw']);
 |
 |      function displayRoute(mapInstance) {
 |          Interface.ensureImplements(mapInstace, DynamicMap);
 |          mapInstance.centerOnPoint(12, 34);
 |          mapInstance.zoom(5);
 |          mapInstance.draw();
 |      }
 |
 */

// Static class method.
module.exports.Interface.ensureImplements = function(object) {

    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " + arguments.length  + "arguments, but expected at least 2.");
    }
    for(var i = 1, len = arguments.length; i < len; i++) {

        var iface = arguments[i];

        if(iface.constructor !== module.exports.Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments" + "two and above to be instances of Interface.");
        }

        for(var j = 0, methodsLen = iface.methods.length; j < methodsLen; j++) {

            var method = iface.methods[j];

            if(!object[method] || typeof object[method] !== 'function') {

                throw new Error("Function Interface.ensureImplements: object " + "does not implement the " + iface.name + " interface. Method " + method + " was not found.");
            } }
    } 
};