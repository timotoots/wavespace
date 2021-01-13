// Config


exports.getConf = function () {

var conf = require(__dirname+'/global.js');
conf = conf.getConf();

conf.maxPlayers = 1;

conf.players = [
	{
		"r":255,
		"g":0,
		"b":0
	}];

conf.speakers = [

 ];

conf.lights = [
	[0,100,100]
];

conf.launchPd = false;

conf.useSerial = false;

/////////////////////////////////////

return conf;

};