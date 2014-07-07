/**
 *  ______     __  __     ______     ______     ______
 * /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
 * \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
 * \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
 *  \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
 *
 * CONTROLLER FILE - dashboard
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

/*
 |--------------------------------------------------------------------------
 | Constructor
 |--------------------------------------------------------------------------
 */
var dashboardController = function(model, view) {
    // Insert the model object into the object
    this.model = model;
    // Insert the view object into the object
    this.view = view;
};

dashboardController.prototype.index = function() {

    // Make the dashboard view
    return this.view.make("dashboard.html");
};

// Export the module!
module.exports = dashboardController;