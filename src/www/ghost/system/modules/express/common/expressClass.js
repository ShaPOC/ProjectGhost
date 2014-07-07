/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * EXPRESS OBJECT FILE
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

var express         = require('express'),
    swig            = require('swig'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    paths           = require('../../../includes/paths.js'),

    routerClass     = require(__dirname + paths.ds + "routerClass"),
    modelClass      = require(__dirname + paths.ds + "modelClass"),
    viewClass       = require(__dirname + paths.ds + "viewClass"),
    controllerClass = require(__dirname + paths.ds + "controllerClass"),

    addMiddlewareClass = require("../lib/addMiddlewareClass.js"),

    OptionsClass    = require(paths.__common + "options.js");

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

    connection : {
        host : "127.0.0.1",
        port : 3333
    },

    default_action : "index",
    default_route_file : "default",

    session_secret : "kYqJceJ90iEkyVNWZCpIQuUIUS9kma4VU0fOhTcaJ5YW64PwPnYPVAmeOtqZQQ5"
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
var expressClass = function(name, app) {

    // We need 'this' later on
    var self = this;

    // Create the express app
    self.app = express();

    // Merge the default options with the options set in the config file
    self.options = new OptionsClass(name).merge(default_options);

    // Make sure the port is a number
    if(typeof self.options.connection.port !== 'number') {
        self.options.connection.port = parseInt(self.options.connection.port,10);
    }

    // Set the template engine to swig
    self.app.engine('html', swig.renderFile);

    // View engine
    self.app.set('view engine', '.html');
    // The view directory
    self.app.set('views', paths.__views);

    // Disable caching by express, swig will cache it, don't worry...
    self.app.set('view cache', false);

    // set the static files location /public/img will be /img for users
    self.app.use(express.static(paths.__public));
    // pull information from html in POST
    self.app.use(bodyParser());
    // simulate DELETE and PUT
    self.app.use(methodOverride());
    // use cookies
    self.app.use(cookieParser());
    // use sessions
    self.app.use(session({ secret: self.options.session_secret, key: 'sid', cookie: { maxAge: 600000 }}));

    // Use our middleware class to fetch more middleware
    var addMiddleWare = new addMiddlewareClass();
    // Add middleware in the application folder
    addMiddleWare.addFolder(self.app, paths.__middleware, function(err){

        if(err) {
            console.log(err);
//            throw new Error(err);
        }

        // Our own middleware
        self.app.use(self.resetRoute(self));

        // Initialize the default objects used
        self.init(app);

        if(app.options.dev) {
            // log every request to the console
            self.app.use(morgan('dev'));
            // Disable cache by swig when in development
            swig.setDefaults({ cache: false });
        }

        self.app.listen(self.options.connection.port);

        app.log.info("Express : Sucessfully booted and listening on port: " + self.options.connection.port);
    });
};

/*
 |--------------------------------------------------------------------------
 | Initialize everything
 |--------------------------------------------------------------------------
 |
 | Create the router and insert the controller model and view for use
 | within the different routes
 |
 */

expressClass.prototype.init = function(app) {

    this.model = new modelClass(app);
    this.view = new viewClass();
    this.controller = new controllerClass(app, this.options, this.model, this.view);
    this.router = new routerClass(this.model, this.view, this.controller);

    this.router.getRouter(this, function(err){

        if(err) {
            throw new Error(err);
        }
    });
};

/*
 |--------------------------------------------------------------------------
 | Reset some basic stuff for every route
 |--------------------------------------------------------------------------
 |
 | This middleware makes sure that everything inside the main regulators
 | is reset to the default.
 |
 */
expressClass.prototype.resetRoute = function(self) {

    return function(req,res,next) {

        self.view.setResponse(res);

        // Make sure we are not dealing with a damn favicon
        if(req.url !== 'favicon.ico') {

            // Make the viewBag
            self.view.setViewBag(req.headers["accept-language"], function(err, viewBag){

                if(err) {
                    throw new Error(err);
                }

                // Set session variables for use inside templates
                viewBag.set("session", req.session);

                next();
            });

        } else {

            next();
        }
    };
};

// Export the module!
module.exports = expressClass;