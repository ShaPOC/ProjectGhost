/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * MODEL CLASS FILE
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

/*
 |--------------------------------------------------------------------------
 | Required modules
 |--------------------------------------------------------------------------
 */

var paths = require('../../../includes/paths.js'),
    fs    = require("fs");

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 */

var modelClass = function(app) {
    // Put the entire app in the object
    this.app = app;
};

/*
 |--------------------------------------------------------------------------
 | Call a model
 |--------------------------------------------------------------------------
 |
 | This function will allow you to call a modal The first parameter takes a
 | string containing the model name, and the second parameter takes modules
 | to be put through to the model like mongodb
 |
 | e.g.:
 |
 |      model.call(user, ['mongodb'])
 |
 */
modelClass.prototype.call = function(modelName, modules) {

    // We need a string in the first argument
    if(typeof modelName !== 'string') {
        throw new Error("Model method call expects parameter 1 to be string. " + typeof modelName + " given.");
    }

    // We need a string in the first argument
    if(typeof modules !== 'undefined' && (typeof modules !== 'object' && !Array.isArray(modules))) {
        throw new Error("Model method call expects parameter 2 to be undefined or Array. " + typeof modules + " given.");
    }

    return this.getModel(modelName, modules);
};

/*
 |--------------------------------------------------------------------------
 | The GetModel method
 |--------------------------------------------------------------------------
 |
 | This method actually fetches the model and returns it completed and
 | prototyped with the required modules
 |
 */
modelClass.prototype.getModel = function(modelName, modules) {

    // We need 'this' later on...
    var self = this;

    // We need a string in the first argument
    if(typeof modelName !== 'string') {
        throw new Error("Model method call expects parameter 1 to be string. " + typeof modelName + " given.");
    }

    if(!fs.existsSync(paths.__models + modelName + ".js")) {
        throw new Error("Model file: " + modelName + ".js could not be found in directory: " + paths.__models);
    }

    // Get the controller file
    var modelClass = require(paths.__models + modelName + ".js");

    if(typeof modules === 'object' && Array.isArray(modules)) {

        modules.forEach(function(moduleName){

            if(typeof self.app[moduleName] !== 'undefined') {

                // Set the module
                modelClass.prototype[moduleName] = self.app[moduleName];

            } else {

                self.app.log.info(moduleName + " as requested by model: " + modelName + " does not exist. Load ignored...");
            }

        });
    }

    // Make sure the controller is a nice class
    if(typeof modelClass !== 'function') {
        throw new Error("Model file: " + modelName + ".js does not return a valid constructor function.");
    }

    // Return the loaded controller file
    return new modelClass();
};

// Export the module!
module.exports = modelClass;