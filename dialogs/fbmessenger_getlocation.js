module.exports = function () {
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
    
}

