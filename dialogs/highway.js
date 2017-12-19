var builder = require('botbuilder');


var Options = {
    Yes: 'Yes',
    No: 'No'
};
module.exports = [
    function (session, results, next) {
        builder.Prompts.choice(
            session,
            'Ok, are there any victims in this accident?',
            [Options.Yes, Options.No],
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
            case Options.Yes:
                builder.Prompts.choice(
                    session,
                    'Oh my God! I pray that they are okay, Would you please help me with their names one by one?',
                    [Options.Yes, Options.No],
                    {
                        maxRetries: 3,
                        retryPrompt: 'Not a valid option'
                    });

               // return session.beginDialog('Yes');
                break;
            case Options.No:
                return session.beginDialog('No');
        }
       
    }
];

