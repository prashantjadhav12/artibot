var builder = require('botbuilder');
var Store = require('../services/store');

var IncidentLocation = {
    Highway: 'Highway',
    City: 'City'
};

var CityNameKey = 'CityName';

module.exports = [
    function (session, results, next) {
        builder.Prompts.text("I hope you are unharmed, what is your name?");
     
    },

    function (session, results, next) {

        if (results && results.response) {
            session.userData[CityNameKey] = results.response;      
        }
        else {
            session.userData[CityNameKey] = '';
        }

        var City = session.userData[CityNameKey];

        builder.Prompts.choice(
        session,
        "Ok %s, It's  so just of you to report this incident, really appreciate that. Where did this accident occurr?", City,
        [IncidentLocation.Highway, IncidentLocation.City],
        {
            maxRetries: 3,
            retryPrompt: 'Not a valid option'
        });
    },

    function (session, results, next) {
        
        var selection = results.response.entity;
        switch (selection) {
            case IncidentLocation.Highway:
                return session.beginDialog('highway');
            case IncidentLocation.City:
                return session.beginDialog('city');
        }

      
        next();
    }
];

