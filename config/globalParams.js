var _ = require('lodash');

var configurations = require('./configurations');


function getValue(env){
	var val = process.env[env];
	if(_.isUndefined(val)){ val = configurations[env]; }
	return val;
}

module.exports = function(){
	var globalParams = {};
    globalParams.HOST_URL = getValue('HOST_URL');
    globalParams.CONTEXT = getValue('CONTEXT');

	return globalParams;
};
