var builder = require('botbuilder');
/*var dlgIncedent = require('./dialogs/accident');
var dlgIncedent = require('./dialogs/fire');
var dlgIncedent = require('./dialogs/riot');
var dlgIncedent = require('./dialogs/others');*/

exports.beginDialog = function (session, options) {
    session.beginDialog('incident', options || {});
}

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCIWDcaf2GyEiUYlwODIilapnFWu5BYzD8'
  });

var DialogLabels = {
    Accident: 'Accident',
    Fire: 'Fire',
    Riot : 'Riot',
    Other : 'Other'
};

exports.create = function (bot) {
bot.dialog("incident", [
    function (session) {
        session.send('Welcome to the Incedent reporting system!');
       
        builder.Prompts.choice(
            session,
            'Please select incedent type',
            [DialogLabels.Accident, DialogLabels.Fire, DialogLabels.Riot],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, results, next) {

        // continue on proper dialog
        var selection = results.response.entity;
        switch (selection) {
            case DialogLabels.Accident:
                return session.beginDialog('accident');
            case DialogLabels.Fire:
                return session.beginDialog('fire');
            case DialogLabels.Riot:
                return session.beginDialog('riot');
        }
    }
    
 ] );

};
