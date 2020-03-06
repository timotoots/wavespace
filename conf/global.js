// Config

exports.getConf = function () {

var conf = {};

/////////////////////////////////////
// Space dimensions in mm

conf.dimensions = {};
conf.dimensions.x = 2100;
conf.dimensions.y = 1400;
conf.dimensions.z = 400;

conf.spacesize_x = 2100;
conf.spacesize_y = 1400;
conf.spacesize_h = 400;

/////////////////////////////////////
// Sound players / Sound shapes

conf.maxPlayers = 8;

conf.players = [
	{
		"r":255,
		"g":0,
		"b":0
	},
	{
		"r":125,
		"g":0,
		"b":255
	},
	{
		"r":0,
		"g":255,
		"b":190
	},
	{
		"r":255,
		"g":255,
		"b":0
	},
		{
		"r":255,
		"g":0,
		"b":0
	},
	{
		"r":125,
		"g":0,
		"b":255
	},
	{
		"r":0,
		"g":255,
		"b":190
	},
	{
		"r":255,
		"g":255,
		"b":0
	}
]

/////////////////////////////////////
// Speaker positions

// soundcard channel, x, y, z, type
conf.speakers = [
  [0,12,20],
  [1,125,53],
  [2,196,12],
  [6,89,88],
  [7,30,105],
  [5,187,105]
 ];

 conf.subwoofers = [
 
 ]


/////////////////////////////////////
// LED RGB Lights

// id, x, y
conf.lights = [
	[0,100,100]
];

/////////////////////////////////////
// Server

conf.mqtt = 'ws://mjkeskus.local:9001';
conf.wavespace_port = 3001;
conf.pdBin = '/Applications/Pd-0.50-0.app/Contents/Resources/bin/pd';

conf.launchChrome = false;
conf.pdNoGui = false;

conf.pdAudioApi = "pa";

/////////////////////////////////////

return conf;

};