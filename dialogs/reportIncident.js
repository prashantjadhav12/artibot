var builder = require('botbuilder');
var Store = require('../services/store');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCIWDcaf2GyEiUYlwODIilapnFWu5BYzD8'
  });

var IncidentTypes = {
    Accident: 'Accident',
    Fire: 'Fire',
    Theft : 'Theft',
    Abuse : 'Abuse'
};
    
module.exports = [

    function (session) {
        session.send('Welcome to the Incident reporting system!');       
        session.send('Before proceeding it would be in your best interest to inform local authorities. For now, would you please attach location by selecting from your messenger application?');
        
        //session.replaceDialog('/locationdemo');
        session.beginDialog('/locationdemo');

        //builder.Prompts.text(session, "Please share you location");    
    },
   
    // Destination
    function (session, results, next) {
              
        builder.Prompts.choice(
            session,
            'Thanks, now we have your location, please select incident type',
            [IncidentTypes.Accident, IncidentTypes.Fire, IncidentTypes.Theft, IncidentTypes.Abuse],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, results, next) {

        // continue on proper dialog
        var selection = results.response.entity;
        switch (selection) {
            case IncidentTypes.Accident:
                return session.beginDialog('dlgAccident');
            case IncidentTypes.Fire:
                return session.beginDialog('fire');
            case IncidentTypes.Theft:
                return session.beginDialog('theft');
            case IncidentTypes.Abuse:
                return session.beginDialog('abuse');
        }

    }];
