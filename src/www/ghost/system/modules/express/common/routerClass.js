/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * ROUTER CLASS FILE
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

var express = require('express'),
    paths   = require('../../../includes/paths.js');

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 */

var routerClass = function(model, view, controller) {

    this.model = model;
    this.view = view;
    this.controller = controller;

};

/*
 |--------------------------------------------------------------------------
 | Get (acually set) the entire router
 |--------------------------------------------------------------------------
 |
 | This method fetches every router file and processes it for use with
 | express
 |
 */
routerClass.prototype.getRouter = function(self, callback) {

    var routes = require('require-all')(paths.__routes);

    if(typeof routes !== "object") {
        callback("No routes were specified or routes could not be found.");
    }

    for(var x in routes) {

        var router = express.Router();

        if(typeof routes[x] !== "object") {
            return callback("Route file: " + x + " was not specified correctly. Please export an object containing routes to this module.");
        }

        for(var r in routes[x]) {

            if(typeof routes[x][r] !== 'function') {
                return callback("Route file: " + x + " contains an error at route: " + r + ". Please use a function to specify a route.");
            }

            var rTest = routes[x][r](this.model, this.view, this.controller);

            if(typeof rTest !== "object") {
                return callback("Route file: " + x + " contains an error at route: " + r + ". Please return an object to this route.");
            }

            for(var ir in rTest) {

                // Put a new route inside the router
                router.route(r)[ir](rTest[ir]);
            }
        }

        // Export the new router to the express app
        self.app.use("/" + ((x !== self.options.default_route_file)?x:""), router);
    }

    callback();

};

// Export the module!
module.exports = routerClass;