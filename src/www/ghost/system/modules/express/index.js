/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * EXPRESS INDEX FILE
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

/*
 |--------------------------------------------------------------------------
 | Boot after everything has loaded
 |--------------------------------------------------------------------------
 |
 | Here we are sure that everything we need is properly loaded and the
 | Express server can now start booting
 |
 */

var expressInit = function(err, app, self) {

    if(err) {
        throw err;
    }

    app.log.info("Express : Booting...");

    // Require the "class" file
    var ExpressClass = require(__dirname + "/common/expressClass.js");
    // Instantiate the express object
    app.express = new ExpressClass(exports.name, app);

    self.done();
};

/*
 |--------------------------------------------------------------------------
 | Pre-class definitions
 |--------------------------------------------------------------------------
 |
 | Here we define some variables and methods required before the module
 | and adjacent class is actually loaded.
 |
 */

// The name of the module
exports.name = "express";

// When the module is being registered
exports.onRegister = function(app) {
    // Wait for arduino before starting express!
    app.waitFor(exports.name, "nedb", expressInit);
};

/*
 |--------------------------------------------------------------------------
 | The boot class
 |--------------------------------------------------------------------------
 */

// Constructor
var expressBoot = function() {};

module.exports.boot = expressBoot;