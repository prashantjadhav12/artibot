var builder = require('botbuilder');
var Store = require('../services/store');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCIWDcaf2GyEiUYlwODIilapnFWu5BYzD8'
  });

var DialogLabels = {
    Accident: 'Accident',
    Fire: 'Fire',
    Riot : 'Riot',
    Other : 'Other'
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


    }];
