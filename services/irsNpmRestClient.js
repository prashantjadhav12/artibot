var Client = require('node-rest-client').Client;
var globalParams = require('../config/globalParams');

/*var options = {
  mimetypes: {
    json: ["application/json", "application/my-custom-content-type-for-json;charset=utf-8"]

  }
};

var client = new Client(options);

*/

var client = new Client();
//var host = globalParams.HOST_URL;
//var context = globalParams.CONTEXT;
var host = 'http://localhost:8080';
var context = '/api';
var baseUrl = host + context;



function performGetRequest(endpoint, args, success) {
  baseUrl += endpoint;
  client.get(baseUrl, args, success);
};

function performPostRequest(endpoint, args, success) {
  baseUrl += endpoint;
  client.post(baseUrl, args, success);
}

function performDeleteRequest(endpoint, args, success) {
  baseUrl += endpoint;
  client.delete(baseUrl, args, success);
}

function performPutRequest(endpoint, args, success) {
  baseUrl += endpoint;
  client.put(baseUrl, args, success);
}

module.exports.performGetRequest = performGetRequest;
module.exports.performPostRequest = performPostRequest;
module.exports.performPutRequest = performPutRequest;
module.exports.performDeleteRequest = performDeleteRequest;

