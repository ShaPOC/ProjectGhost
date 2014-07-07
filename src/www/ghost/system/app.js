/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * Boot file - Facade pattern like file starting everything
 * required for the server to function.
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

'use strict';

// Constructor
var appClass = function(options) {

    // Make sure the options parameters is an object
    if(typeof options !== 'undefined' && typeof options !== 'object') {
        throw new Error("The constructor for appClass expects the first " +
            "parameter to be of type; 'object'. " + typeof options+ " given.");
    }

    // Create an object to be filled by boot method objects
    this.bootRegister = {};
    // Create an object to be filled with dependency expectations
    // When a module waits for a module which has not been registered yet,
    // then it will be noted in this object
    this.dependencyExpectations = {};
    // Take the options object and stuff it inside the app object
    this.options = options || {};

};

/*
 |--------------------------------------------------------------------------
 | Register boot methods
 |--------------------------------------------------------------------------
 |
 | This method will register methods as a set method so they can be
 | executed properly by the boot process (completely event driven and neat)
 |
 | The first parameter accepts the function which will eventually be
 | called containing the entire boot object. This object contains various
 | event methods, so registered functions can be called subsequently.
 |
 | The second parameter is optional and will accept an Array containing
 | parameters for the function to use.
 |
 */

appClass.prototype.register = function(module, parameters) {

    // We need it inside the done function
    var app = this;

    if(typeof module.boot !== 'function') {
        throw new Error("The register method for appClass expects the first " +
            "parameter to be of type; 'function'. " + typeof options+ " given.");
    }

    // Make sure the inserted parameter doesn't already
    // exist in the boot register
    if(typeof app.bootRegister[module.name] !== 'undefined') {
        return false;
    }

    // If the module has an onRegister function, trigger it now!
    if(typeof module.onRegister === 'function') {
        module.onRegister(app);
    }

    // We need to set a new done function for this module
    module.boot.prototype.done = function(){
        app.done(module.name);
    };

    // Add an object containing all information to be used later
    app.bootRegister[module.name] = {
        method : module.boot,
        parameters : parameters,
        waitList : {},
        done : false
    };

    // If there is a dependency waiting...
    if(typeof app.dependencyExpectations[module.name] !== 'undefined') {

        for(var wn in app.dependencyExpectations[module.name]) {
            // Make sure they go in the waiting list
            app.bootRegister[module.name]["waitList"][wn] = app.dependencyExpectations[module.name][wn];
        }
        // Now that hey are in the proper place, remove them from the
        // dependency expectation list
        delete app.dependencyExpectations[module.name];
    }
};

/*
 |--------------------------------------------------------------------------
 | Wait for another module
 |--------------------------------------------------------------------------
 |
 | With this method we can specify that a certain module must wait for
 | another module to finish loading
 |
 */

appClass.prototype.waitFor = function(name, dependency, callback) {

    // Make sure it's an array!
    if(typeof dependency === 'string') {
        dependency = [dependency];
    }

    for(var x in dependency) {

        // If the module is already registered, then that's great
        if(typeof this.bootRegister[dependency[x]] !== 'undefined') {

            this.bootRegister[dependency[x]]["waitList"][name] = callback;

            // But if it's not, then wait for it to register first
        } else {

            // Make sure to create an object if required
            if(typeof this.dependencyExpectations[dependency[x]] === 'undefined') {
                this.dependencyExpectations[dependency[x]] = {};
            }

            // Then push it to the object so we can get it later
            this.dependencyExpectations[dependency[x]][name] = callback;
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Report finished
 |--------------------------------------------------------------------------
 |
 | This method enables modules to tell the app whether it has completed
 | loading. if so, dependant modules can be triggered and when everything
 | is complete this can be reported.
 |
 */

appClass.prototype.done = function(name) {

    // We need it inside the callback
    var app = this;

    // Make sure the module exists in the register
    if(typeof app.bootRegister[name] === 'undefined') {
        return false;
    }

    // Set the module to done!
    app.bootRegister[name].done = true;

    // Test to see if there are modules waiting, if not, just stop
    if(Object.keys(app.bootRegister[name]["waitList"]).length > 0) {
        for(var wn in app.bootRegister[name]["waitList"]) {
            // We need the third parameter to be the instantiated object, for we
            // cannot be sure that it has access to it at the point of calling
            app.bootRegister[name]["waitList"][wn](null, app, app[wn]);
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Boot now!
 |--------------------------------------------------------------------------
 |
 | Start the magic of the boot process! Here every method inserted before
 | will be triggered containing the boot object and the parameters as set
 | in the register method.
 |
 */

appClass.prototype.boot = function() {

    // We need it inside the foreach
    var app = this;

    for(var name in app.bootRegister) {
        // Start every method registered and insert the boot object and
        // the parameters set before.
        app[name] = new app.bootRegister[name].method(app, app.bootRegister[name].parameters);
    }
};

// Now export the class to the outside world
module.exports = appClass;