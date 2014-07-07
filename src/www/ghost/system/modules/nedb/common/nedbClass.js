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
 | Required modules
 |--------------------------------------------------------------------------
 */

var paths        = require('../../../includes/paths.js'),
    OptionsClass = require(paths.__common + "options.js");

/*
 |--------------------------------------------------------------------------
 | Default options object
 |--------------------------------------------------------------------------
 |
 | This object will be used to create a new config file when one doesn't
 | exist already inside the root/config folder. It will also be
 | used to define the default values of these options.
 |
 */

var default_options = {


};

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 |
 | Instantiate some variables and use the options object to merge the
 | default options above with options inside the configuration file with
 | the same name as the module
 |
 */
var nedbClass = function(name) {

    // Merge the default options with the options set in the config file
    this.options = new OptionsClass(name).merge(default_options);
};

/*
 |--------------------------------------------------------------------------
 | The initialisation of the database connection
 |--------------------------------------------------------------------------
 |
 | Check for some requirements and then connect to the database. When
 | connected successfully, the callback will be triggered containing no
 | parameters because the connections are stored within the mongoClass
 | object.
 |
 */
nedbClass.prototype.init = function(callback) {

    callback();
};

// Export the module!
module.exports = nedbClass;