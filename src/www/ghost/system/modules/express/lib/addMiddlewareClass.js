/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * MIDDLEWARE CLASS FOR EXPRESS
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

var fs = require("fs");

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 */

var addMiddlewareClass = function() {};

/*
 |--------------------------------------------------------------------------
 | AddFolder
 |--------------------------------------------------------------------------
 |
 | Add all middleware files inside a folder to the given express app
 |
 */
addMiddlewareClass.prototype.addFolder = function(app, path, callback) {

    fs.exists(path, function(result){

        if(!result) {
            return callback("addMiddlewareClass.addFolder: Given folder does not exist");
        }

        fs.readdir(path, function(err, files){

            if(err) {
                return callback(err);
            }

            files.forEach(function(file){

                var middleWare = require(path + file);

                if(!Array.isArray(middleWare)) {
                    return callback("Middleware folder: " + path + " expects file " + file + " to export an Array containing middleware functions. " + typeof middleWare + " given.");
                }

                middleWare.forEach(function(mw){
                    app.use(mw);
                });
            });

            return callback(null);
        });
    });
};


// Export the module!
module.exports = addMiddlewareClass;