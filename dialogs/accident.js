var builder = require('botbuilder');
var Store = require('../services/store');

var ReporterTypes = {
    Victim: 'Victim',
    Reporter: 'Reporter'
};
module.exports = [
    function (session, results, next) {
        builder.Prompts.choice(
            session,
            'May I know if you are a victim or a reporter?',
            [ReporterTypes.Reporter, ReporterTypes.Victim],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },

    function (session, results, next) {

        // continue on proper dialog
        var selection = results.response.entity;
        console.log('Selection: %s', selection);
        switch (selection) {
            case ReporterTypes.Victim:
                return session.beginDialog('victim');
            case ReporterTypes.Reporter:
                return session.beginDialog('reporter');
        }
       
    }
];

