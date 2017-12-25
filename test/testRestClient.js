var irsNpmRestClient = require('../services/irsNpmRestClient');

var endpoint = '/notes';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Test POST method
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var args = {
    path: { "id": 120 },
    parameters: { arg1: "hello", arg2: "world" },
    headers: { 'Content-Type': 'application/json' },
    data: {"title":"Prashant\'s Note 2", "content":"Sometimes you have to burn yourself to the ground before you can rise like a phoenix from the ashes. - Jens Lekman"}
};

// Uncomment below to test POST method
/*
irsNpmRestClient.performPostRequest(endpoint, args, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
  //  console.log(response);
  });
*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test GET method
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
var args2 = {
    path: { },
    parameters: { },
    headers: { 'Content-Type': 'application/json' },
    data: { }
};

  irsNpmRestClient.performGetRequest(endpoint, args2, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
   // console.log(response);
  });
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test PUT method
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var endpoint = '/notes/${noteId}';

var args2 = {
    path: { "noteId" : 5 },
    parameters: { },
    headers: { 'Content-Type': 'application/json' },
    data: {"title":"Prashant\'s Note updated", "content":"Sometimes you have to burn yourself to the ground before you can rise like a phoenix from the ashes. - Jens Lekman"}
};

  irsNpmRestClient.performPutRequest(endpoint, args2, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
   // console.log(response);
  });
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test DELETE method
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var endpoint = '/notes/${noteId}';

var args2 = {
    path: { "noteId" : 6 },
    parameters: { },
    headers: { 'Content-Type': 'application/json' },
    data: { }
};

  irsNpmRestClient.performDeleteRequest(endpoint, args2, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
   // console.log(response);
  });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////