/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * CONTROLLER CLASS FILE
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

var controllerClass = function(app, options, model, view) {
    // Put the entire app in the object
    this.app = app;
    // Insert the options into the object
    this.options = options;
    // Insert the model object into the object
    this.model = model;
    // Insert the view object into the object
    this.view = view;
};

/*
 |--------------------------------------------------------------------------
 | Call a controller and action
 |--------------------------------------------------------------------------
 |
 | This function will allow you to call a controller and optionally an
 | action. The first parameter takes a string containing the controller
 | and optionally action, and the second parameter takes arguments to be
 | put through to the controller and optionally action in array form.
 |
 | e.g.:
 |
 |      controller.call(user@login, ['please login first'])
 |
 */
controllerClass.prototype.call = function(caName, args) {

    // We need 'this' later on...
    var self = this;

    // We need a string in the first argument
    if(typeof caName !== 'string') {
        throw new Error("Controller method call expects parameter 1 to be string. " + typeof caName + " given.");
    }

    // Splits the first argument into an array to define the
    // controller and action name
    var direction   = caName.split("@");

    return this.getController(direction[0], function(err, controller){

        if(err) {
            throw new Error(err);
        }

        // The action is either defined, or you will need the default action
        var action = ((direction[1])?direction[1]:self.options.default_action);

        if(typeof controller[action] !== 'function') {
            throw new Error("Action: " + action + " could not be found in controller: " + direction[0]);
        }

        // Start the action method inside the controller and insert the arguments
        controller[action].apply(controller, args);
    });
};

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 |
 | Get the controller object or return a nice error when the file or
 | method could not be found.
 |
 */
controllerClass.prototype.getController = function(controllerName, callback) {

    // We need 'this' later on...
    var self = this;

    // We need a string in the first argument
    if(typeof controllerName !== 'string') {
        return callback("Controller method call expects parameter 1 to be string. " + typeof controllerName + " given.");
    }

    // Check if the controller file exists
    fs.exists(paths.__controllers + controllerName + ".js", function(exists){

        // If the file doesn't exist, let the callback know and stop everything
        if(!exists) {
            return callback("Controller file: " + controllerName + ".js could not be found in directory: " + paths.__controllers);
        }

        // Get the controller file
        var controllerClass = require(paths.__controllers + controllerName + ".js");

        // Insert the app into the prototype of the controller object
        controllerClass.prototype.app = self.app;

        // Make sure the controller is a nice class
        if(typeof controllerClass !== 'function') {
            return callback("Controller file: " + controllerName + ".js does not return a valid constructor function.");
        }

        // Return the loaded controller file
        return callback(null, new controllerClass(self.model, self.view));
    });
};

// Export the module!
module.exports = controllerClass;