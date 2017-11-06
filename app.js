var restify = require('restify');
var builder = require('botbuilder');
require('./dialogs/fbmessenger_getlocation.js')();


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
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Do you want to report an incedent?',
            [DialogLabels.Yes, DialogLabels.No, DialogLabels.Help],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
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


        builder.Prompts.text(session, "Please share you location");
        session.beginDialog('/fbmessenger_getlocation');

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Yes:
                session.send('channelId : %s', session.message.address.channelId);
                session.send('User : %s', session.message.address.user.name);
               // session.beginDialog('/fbmessenger_getlocation');
                
                
                return session.beginDialog('reportIncedent');
            case DialogLabels.No:
                return session.beginDialog('support');
            case DialogLabels.Help:
                return session.beginDialog('support');
        }
    }
]);

bot.dialog('reportIncedent', require('./dialogs/reportIncedent'));
//bot.dialog('fbmessenger_getlocation', require('./dialogs/fbmessenger_getlocation'));
//bot.dialog('hotels', require('./hotels'));
bot.dialog('support', require('./dialogs/support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });
/*
bot.dialog('/getUserLocation', [
    function (session){
        builder.Prompts.text(session, "Send me your current location.");
    },
    function (session) {

        if (session.message.entities.length > 0) {
            var type = session.message.entities[0].type;
            if (type.toLowerCase() == "place") {
                session.userData.location = session.message.entities[0].geo;
                doSomethingWithUserLocation();
            }
        }


        if(session.message.entities.length != 0){
            session.userData.lat = session.message.entities[0].geo.latitude;
            session.userData.lon = session.message.entities[0].geo.longitude;
            
            session.endDialog("%s  %s", session.userData.lat, session.userData.lon);
        }else{
            session.endDialog("Sorry, I didn't get your location.");
        }
    }
]);
*/
/*
bot.dialog('/fbmessenger_getlocation', new builder.SimpleDialog((session, args) => {
    
    var initialRetryFlag = 3;
    var retryFlag = session.dialogData.hasOwnProperty('maxRetryFlag') 
    ? session.dialogData.maxRetryFlag : initialRetryFlag;
    var entityList = session.message.entities;

    if (session.dialogData.hasOwnProperty('maxRetryFlag') 
    && Array.isArray(entityList) && entityList.length 
    && entityList[0].geo) {

        var latit = roundNumber(entityList[0].geo.latitude, 3);
        var longit = roundNumber(entityList[0].geo.longitude, 3);

        // you got the latitude and longitude values. 
        // You can do the processing as per your requirement
        session.send("Latitude : "+latit);
        session.endDialog("Longitude : "+longit);
    }
    else if (retryFlag == 0) {
        // max retryFlag, quit
        session.endDialogWithResult({});
    }
    else {

        var replyMsg = new builder.Message(session).text
        ("Please share your location.");
        replyMsg.sourceEvent({
            facebook: {
                quick_replies:
                [{
                    content_type: "location"
                }]
            }
        });
        session.send(replyMsg);

        retryFlag -= 1;
        session.dialogData.maxRetryFlag = retryFlag;
    }
}));*/

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});
