var builder = require('botbuilder');
var locationPrompt = require('../prompts/location-prompt'); 
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
                session.send('channelId : %s', session.message.address.channelId);
                session.send('User : %s', session.message.address.user.name); 
                locationPrompt.create(bot);
                session.replaceDialog('/locationdlg');
                //return session.beginDialog('accident');
           // case DialogLabels.Fire:
               // return session.beginDialog('fire');
           // case DialogLabels.Riot:
               // return session.beginDialog('riot');
        }
    }
    
 ] );



 bot.dialog('/locationdlg', [
    function (session, args, next) {
        locationPrompt.beginDialog(session);
    },
    function (session, args, next) {
        if (args.response) {
            var location = args.response.entity;
            session.send(`Location received: ${location.title}, lat: ${location.coordinates.lat}, long: ${location.coordinates.long}`);
            session.endDialog();
        } else {
            session.send('No location received');
            session.endDialog();            
        }
    }
])

};


