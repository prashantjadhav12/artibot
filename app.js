var restify = require('restify');
var builder = require('botbuilder');
var locationPrompt = require('./prompts/location-prompt');
var dlgIncedent = require('./dialogs/incedent');
//var quickReplies = require('./facebook/quickreplies');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var DialogLabels = {
    Yes: 'Yes',
    No: 'No',
    Help: 'Help'
};


var bot = new builder.UniversalBot(connector, [
    function (session, args, next) {
        session.beginDialog('/start');
    },
    function (session, args, next) {

    }
]);

locationPrompt.create(bot);


bot.dialog('/start', [
    function (session, result, next) {
        
        builder.Prompts.choice(session,  'Do you want to report an incedent?',
            [DialogLabels.Yes, DialogLabels.No, DialogLabels.Help],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result, next) {

        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

         // continue on proper dialog
         var selection = result.response.entity;
         switch (selection) {
             case DialogLabels.Yes:
               //  session.send('channelId : %s', session.message.address.channelId);
               //  session.send('User : %s', session.message.address.user.name); 
               dlgIncedent.create(bot);    
               return session.beginDialog('incident');          
             case DialogLabels.No:
                 return session.beginDialog('support');
             case DialogLabels.Help:
                 return session.beginDialog('support');
         }              
    }
]);


bot.dialog('/locationdemo', [
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


//bot.dialog('reportIncedent', require('./dialogs/reportIncedent'));
//bot.dialog('fbmessenger_getlocation', require('/fbmessenger_getlocation'));
//bot.dialog('hotels', require('./hotels'));
bot.dialog('support', require('./dialogs/support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });


// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

