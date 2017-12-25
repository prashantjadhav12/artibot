/*var querystring = require('querystring');
var https = require('https');

var host = 'localhost:8080';
var username = 'username';
var password = '*****';


function performGetRequest(endpoint, data, success) {
  performRequest(endpoint, 'GET', data, success);

}

function performPostRequest(endpoint, data, success) {
  performRequest(endpoint, 'POST', data, success);
}


function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
    
  if (method == 'GET') {    
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}*/