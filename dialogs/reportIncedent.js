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
        session.send('Welcome to the Incedent reporting system!');
       
        //session.send('Please share you location');

        builder.Prompts.text(session, "Please share you location");

    },
    function (session, results, next) {

     session.send("session.message.entities.length : %s", session.message.entities.length);   

    if (session.message.entities.length > 0) {
        var type = session.message.entities[0].type;
        session.send("session.message.entities[0].type : %s", type);
        session.send("session.message.entities[0].geo : %s", session.message.entities[0].geo);   
        if (type.toLowerCase() == "place") {
            session.userData.location = session.message.entities[0].geo;
            doSomethingWithUserLocation();
        }
    }

    next();

    },
 
    // Destination
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


    }];
