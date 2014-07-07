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
 | Pre-class definitions
 |--------------------------------------------------------------------------
 |
 | Here we define some variables and methods required before the module
 | and adjacent class is actually loaded.
 |
 */

// The name of the module
exports.name = "nedb";

// When the module is being registered
exports.onRegister = function(app) {

    app.log.info("NEDB : Booting...");

    // Require the "class" file
    var NedbClass = require(__dirname + "/common/nedbClass.js");
    // Instantiate the mongodb object
    app.nedb = new NedbClass(exports.name);
};


/*
 |--------------------------------------------------------------------------
 | The boot class
 |--------------------------------------------------------------------------
 */

// Constructor
var nedbBoot = function(app) {

    var self = this;

    app.nedb.init(function(err, nedb){

        if(err) {
            throw err;
        }

        // Set itself as itself
        app.nedb = nedb;

        app.log.info("NEDB : Sucessfully booted...");

        self.done();
    });

};

module.exports.boot = nedbBoot;