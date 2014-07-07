/**
 *  ______     __  __     ______     ______     ______
 * /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
 * \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
 * \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
 *  \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

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

var snifferInit = function(err, app, self) {

    if(err) {
        throw err;
    }

    app.log.info("Sniffer : Booting...");

    // Require the "class" file
    var SnifferClass = require(__dirname + "/common/snifferClass.js");
    // Instantiate the express object
    app.express = new SnifferClass(exports.name, app);

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
exports.name = "sniffer";

// When the module is being registered
exports.onRegister = function(app) {
    // Wait for arduino before starting express!
    app.waitFor(exports.name, "nedb", snifferInit);
};

/*
 |--------------------------------------------------------------------------
 | The boot class
 |--------------------------------------------------------------------------
 */

// Constructor
var snifferBoot = function() {};

module.exports.boot = snifferBoot;