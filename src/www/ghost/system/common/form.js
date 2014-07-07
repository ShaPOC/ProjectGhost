/**
 *  ______     __  __     ______     ______     ______
 * /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
 * \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
 * \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
 *  \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
 *
 * FORM HELPER FILE
 *
 * Some general functions used when validating forms
 *
 * @author Jimmy Aupperlee <jimmy@codeprogressive.com>
 * @copyright codeProgressive
 */

/*jslint node: true */
'use strict';

/*
 |--------------------------------------------------------------------------
 | The constructor
 |--------------------------------------------------------------------------
 */

var formClass = function() {};

/*
 |--------------------------------------------------------------------------
 | checkForError - Validate method
 |--------------------------------------------------------------------------
 |
 | Validate an entire form and return an object containing errors or
 | return false. This way you can easily create a conditional statement
 | asking if this method returns something
 |
 | e.g.
 |
 | if(form.checkForError) {
 |      error given...
 | }
 |
 */

formClass.prototype.checkForError = function(object) {

    if(typeof object !== 'object') {
        throw new Error("Function checkForError expects parameter 1 to be object, " + typeof object + " given.");
    }

    // Set the error to false (returned at the end)
    var err = false;

    // Check every value in the object
    for(var fieldName in object) {

        if(typeof object[fieldName] !== 'object') {
            throw new Error("Function checkForError expects parameter 1's content to be objects. " + fieldName + ":  " + typeof object + " given.");
        }

        if(typeof object[fieldName].type !== 'string') {
            throw new Error("Function checkForError expects parameter 1's content to contain a 'type' parameter, null given");
        }

        if(object[fieldName].required && this.removeWhiteSpace(object[fieldName].content).length <= 0) {

            // Make sure we are dealing with an object now
            if(typeof err !== 'object') {
                err = {};
            }
            err[fieldName] = "has-error";
        }

        switch(object[fieldName].type) {

            // TODO : Add more possible value types to check!

            default : {

            }
        }
    }

    // It's either still false, or it's an object with errors
    return err;
};

/*
 |--------------------------------------------------------------------------
 | Remove whitespace
 |--------------------------------------------------------------------------
 |
 | Removes all whitespace including tabs and newlines.
 |
 */
formClass.prototype.removeWhiteSpace = function(string) {
    if(typeof string !== 'string') {
        return string;
    }
    return string.replace(/\s+/, "");
};

// Export the module!
module.exports = formClass;