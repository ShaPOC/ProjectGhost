/**
 *  ______     __  __     ______     ______     ______
 * /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
 * \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
 * \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
 *  \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
 *
 * OPTIONS HELPER FILE
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

// Modules used by the options object
var fs = require("fs"),
    paths = require("../includes/paths.js");

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 |
 | Here we are going to look for a config file and then require it as a
 | module. Then we insert it into this options object so we can use it
 | later.
 |
 */

var options = function(_path) {

    // Get the path where the file exists
    var path = (function() {
        // This is eventually going to be returned into the path variable
        var r = null;
        // We will iterate through this array and test each value
        [
            _path,
            _path + ".js",
            paths.__config + _path,
            paths.__config + _path + ".js",
            paths.__config + "modules" + paths.ds + _path,
            paths.__config + "modules" + paths.ds + _path + ".js"
        ]
        .forEach(function(p){
            // We will test to see if the path actually exists,
            // if it does, put it in the variable we are going to return
            if(fs.existsSync(p)) {
                r = p;
                return true;
            }
        });
        return r;
    })();

    // When found, set the config, else set an empty object
    this.config = ((typeof path === 'string') ? require(path) : {});
};

/*
 |--------------------------------------------------------------------------
 | Merge defaults with file
 |--------------------------------------------------------------------------
 |
 | Insert a default options object (doo) into this function to merge the
 | config file with the default options inserted. The config file will
 | overwrite default options and options not specified will be added as
 | default specifies with the default value.
 |
 | The iterate parameter is optional and will be become the object which
 | to be merged with the doo. Primarily used by the function itself to
 | iterate through deep objects.
 |
 */

options.prototype.merge = function(doo, iterate) {

    var source = doo,
        config = iterate || this.config;

    // Check if everything is still okay (an object)
    if(typeof config !== "object") {
        throw new Error("Option merge: Configuration to merge with could not be found.");
    }

    // Loop through the new options inside the config file
    for(var prop in config) {

        // Create the content inside the array when it's not already there,
        // because sometimes the default object only specifies one entry, whilst
        // the actual configuration has more than one entry. If so, use the first
        // element of the array as a template from the doo.
        if(Array.isArray(config) && !source[prop]){
            if(!source[0]) {
                throw new Error("Option merge: Unexpected error occurred, no template for option: " + config);
            }
            // Create a recursive copy
            source[prop] = this.deepCopy(source[0]);
        }

        // If an array or object is given ...
        if (Array.isArray(config[prop]) || typeof config[prop] === "object") {

            if(!Array.isArray(config) && !(prop in source)) {
                throw new Error("Option merge: Unexpected option specified in configuration: " + prop);
            }

            // Repeat the merge for everything inside it!
            source[prop] = this.merge(source[prop], config[prop]);

        // If it's just a variable then overwrite the default with the new config!
        } else {

            if(source[prop] && typeof config[prop] !== typeof source[prop]) {
                throw new Error("Option merge: Option of type: " + typeof source[prop] + " expected. " + config[prop] + " given at key: " + prop);
            }

            source[prop] = config[prop];

        }
    }

    return source;
};

/*
 |--------------------------------------------------------------------------
 | Create a deep copy of an object or array
 |--------------------------------------------------------------------------
 |
 | We need this to copy something instead of just keeping it's reference
 | inside another variable.
 |
 */
options.prototype.deepCopy = function(obj) {

    // Predefine variables (strict)
    var out, i, len;

    // When we are dealing with an array
    if (Object.prototype.toString.call(obj) === '[object Array]') {

        // Create a new array, set the count to 0 and
        // set the length to count to, to the array length
        out = [];
        i = 0;
        len = obj.length;

        // Loop through recursively and put the copies inside
        // the newly created array
        for ( ; i < len; i++ ) {
            out[i] = this.deepCopy(obj[i]);
        }

        // Then return the new array
        return out;
    }
    // Or if we're dealing with an object...
    else if (typeof obj === 'object') {

        // Create a new object
        out = {};

        // Loop through recursively and put the copies inside
        // the newly created object
        for ( i in obj ) {
            out[i] = this.deepCopy(obj[i]);
        }

        // Then return the new object
        return out;
    }
    // When we are completely done, return everything
    return obj;
};

// Export the module!
module.exports = options;