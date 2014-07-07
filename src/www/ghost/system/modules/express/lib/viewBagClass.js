/**
 *
 * ╔═╗╔═╗┌─┐┬─┐┌─┐┌┬┐┌─┐┬ ┬┌─┐┬─┐┬┌─
 + ║  ╠═╝├┤ ├┬┘├─┤│││├┤ ││││ │├┬┘├┴┐
 + ╚═╝╩  └  ┴└─┴ ┴┴ ┴└─┘└┴┘└─┘┴└─┴ ┴
 *
 * CodeProgressive Framework for Node.JS
 *
 * VIEWBAG GENERATION CLASS
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

var paths        = require("../../../includes/paths.js"),
    fs           = require("fs"),
    locale       = require("locale"),
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

    locale : {

        default_language : "en-US",
        available_languages : [
            "en-US"
        ]
    }
};

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 */

var viewBagClass = function(accepted_languages) {

    // Merge the default options with the options set in the config file
    this.options = new OptionsClass("general").merge(default_options);
    // Create the viewbag variable used throughout the class
    this.viewBag = {};
    // Set the default language
    this.default = locale.Locale[accepted_languages || this.options.locale.default_language];
    // Supported languages
    this.supported = new locale.Locales(this.options.locale.available_languages);
    // Set the locales object
    this.locales = new locale.Locales(accepted_languages);
};

/*
 |--------------------------------------------------------------------------
 | AddFolder
 |--------------------------------------------------------------------------
 |
 | Add an entire folder of viewBag files. All exported objects inside this
 | folder will be merged with the current viewBag and being given privilege
 | over the items already in there.
 |
 */
viewBagClass.prototype.addFolder = function(path, callback) {

    var self = this;

    return fs.exists(path, function(result){

        if(!result) {
            return callback("viewBagClass.addFolder: Given folder does not exist");
        }

        return fs.readdir(path, function(err, files){

            if(err) {
                return callback(err);
            }

            files.forEach(function(file){

                if(!fs.statSync(path + file).isDirectory()) {
                    // Merge the file with the viewBag
                    self.merge(require(path + file));
                }
            });

            // Execute the callback
            return callback(null);
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | AddLocale Folder
 |--------------------------------------------------------------------------
 |
 | Expects a path to a folder containing multiple folders with language
 | codes in it (e.g. en-US) and picks the preferred language. It also
 | merges with the default language when the variable does exist in the
 | default language and not in the preferred language.
 |
 */
viewBagClass.prototype.addLocaleFolder = function(path, callback) {

    var self = this;

    return fs.exists(path, function(result){

        if(!result) {
            return callback("viewBagClass.addFolder: Given folder does not exist");
        }

        [
            path + self.default,
            path + self.locales.best(self.supported)
        ]
        .forEach(function(valPath){

            if(fs.existsSync(valPath)) {

                self.addFolder(valPath);
            }
        });

        // Execute the callback
        return callback(null);
    });
};

/*
 |--------------------------------------------------------------------------
 | Recursive merge
 |--------------------------------------------------------------------------
 |
 | We need the object to be merged recursivly. This function is mostly used
 | from within the class itself.
 |
 */
viewBagClass.prototype.recursiveMerge = function(originalViewBag, newViewBag) {

    // Loop through all the values in the new viewBag
    for (var p in newViewBag) {

        try {
            // Property in destination object set; update its value.
            if ( newViewBag[p].constructor === Object ) {

                originalViewBag[p] = this.recursiveMerge(originalViewBag[p], newViewBag[p]);

            } else {

                originalViewBag[p] = newViewBag[p];

            }

        } catch(e) {
            // Property in destination object not set; create it and set its value.
            originalViewBag[p] = newViewBag[p];

        }
    }

    return originalViewBag;
};

/*
 |--------------------------------------------------------------------------
 | Merge
 |--------------------------------------------------------------------------
 |
 | Merge the input array with the viewBag of this object. The inserted
 | viewBag has privilege over the viewBag already in this object.
 |
 */
viewBagClass.prototype.merge = function(viewBag) {

    // Merge that stuff recursively!
    this.viewBag = this.recursiveMerge(this.viewBag, viewBag);
};

/*
 |--------------------------------------------------------------------------
 | Set
 |--------------------------------------------------------------------------
 |
 | Set variable(s) in the viewBag to be merged later with a viewBag
 | specific to a template or controller.
 |
 | The first parameter can either be an object (containing multiple keys)
 | or a key name.
 |
 | The second parameter can only be a value which will be linked to the
 | key name of the first parameter inside the viewBag.
 |
 */
viewBagClass.prototype.set = function(key, value) {

    if(typeof key !== 'string') {
        throw new Error("ViewBagClass.set expects the first parameter to be of type string, " + typeof key + " given.");
    }

    if(typeof value === 'undefined') {
        throw new Error("ViewBagClass.set expects the second parameter to be set.");
    }

    // Set the value
    this.viewBag[key] = value;
};

// Export the module!
module.exports = viewBagClass;