var builder = require('botbuilder');
var Store = require('../services/store');

var IncidentLocation = {
    Highway: 'Highway',
    City: 'City'
};
var reporterNameKey = 'reporterName';

module.exports = [
    function (session, results, next) {
        builder.Prompts.text(session, "I hope you are unharmed, what is your name?");
     
    },

    function (session, results, next) {

        if (results && results.response) {
            session.userData[reporterNameKey] = results.response;      
        }
        else {
            session.userData[reporterNameKey] = '';
        }

        var reporter = session.userData[reporterNameKey];

        builder.Prompts.choice(session, "Ok '" + reporter + "', It's so just of you to report this incident,"
        + " really appreciate that. Where did this accident occurr?",
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
