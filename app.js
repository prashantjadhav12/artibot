var restify = require('restify');
var builder = require('botbuilder');
var locationPrompt = require('./prompts/location-prompt');
var quickReplies = require('./facebook/quickreplies');

//var express = require("express");
//var request = require("request-promise");
//require('./dialogs/fbmessenger_getlocation.js')();


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
        session.beginDialog('/startdemo');
    },
    function (session, args, next) {

    }
]);

locationPrompt.create(bot);
/*
bot.use({
    botbuilder: function (session, next) {
        if (session.message.source == "facebook") {
            if (session.message.sourceEvent && session.message.sourceEvent.message) {
                if (session.message.sourceEvent.message.quick_reply) {
                    session.message.text = session.message.sourceEvent.message.quick_reply.payload;
                    session.send(`Quick reply text received: ${session.message.text}`);
                    session.endDialog();
                }
            }
        }

        next();
    }
});*/


bot.dialog('/startdemo', [
    function (session, args, next) {
        builder.Prompts.choice(session, 'This bot demonstrates using Facebook Quick Replies, which demo would you like to see?', ['Text', 'Location']);
    },
    function (session, args, next) {
        if (args.response) {
            var choice = args.response.entity;
            switch (choice) {
                case 'Text':
                    session.replaceDialog('/textdemo');
                    break;
                case 'Location':
                    session.replaceDialog('/locationdemo');
            }
        }
    }
]);

// Demonstrates text based quick replies
bot.dialog('/textdemo', [
    function (session, args, next) {
        var message = new builder.Message(session).text('Pick a size:');
        quickReplies.AddQuickReplies(session, message, [
            new quickReplies.QuickReplyText('Small', 'small'),
            new quickReplies.QuickReplyText('Medium', 'medium'),
            new quickReplies.QuickReplyText('Large', 'large')
        ]);

        session.send(message);

        session.endDialog();
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

/*
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


      //  builder.Prompts.text(session, "Please share you location");
          //  session.beginDialog('/fbmessenger_getlocation');

        session.send("Share details");
        session.beginDialog("/send_share_button");


    

       

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Yes:
                session.send('channelId : %s', session.message.address.channelId);
                session.send('User : %s', session.message.address.user.name);
               // session.beginDialog('/fbmessenger_getlocation');
                
                
            //    return session.beginDialog('reportIncedent');
            case DialogLabels.No:
                return session.beginDialog('support');
            case DialogLabels.Help:
                return session.beginDialog('support');
        }
    }
]);


*/


bot.dialog('reportIncedent', require('./dialogs/reportIncedent'));
//bot.dialog('fbmessenger_getlocation', require('/fbmessenger_getlocation'));
//bot.dialog('hotels', require('./hotels'));
bot.dialog('support', require('./dialogs/support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });


bot.dialog('/fbmessenger_getlocation', new builder.SimpleDialog((session, args) => {
    
    var initialRetryFlag = 3;
    var retryFlag = session.dialogData.hasOwnProperty('maxRetryFlag') 
    ? session.dialogData.maxRetryFlag : initialRetryFlag;
    var entityList = session.message.entities;


    session.send("session.dialogData.hasOwnProperty('maxRetryFlag') : "+ session.dialogData.hasOwnProperty('maxRetryFlag'));
    session.send("Array.isArray(entityList) : "+ Array.isArray(entityList));
    session.send("entityList.length "+ entityList.length);
    session.send("entityList[0].geo "+ entityList[0].geo);

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

         session.send("inside else...");
         
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
}));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});



//where we create a facebook share button using sourceEvent
bot.dialog("/send_share_button", function (session) {
    //construct a new message with the current session context
    var msg = new builder.Message(session).sourceEvent({
        //specify the channel
        facebook: {
                quick_replies:
                [{
                    content_type: "location"
                }]
            }
    });

    //send message
    session.send(msg);
    session.endDialog("Show your friends!");
});