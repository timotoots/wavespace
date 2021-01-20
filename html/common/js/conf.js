
var conf = {};

conf.mqtt_ip = 'wavespace.local';
conf.mqtt_settings = {'username':'','password':''}
conf.mqtt_prepend = 'wavespace'




/////////////////////////////////////
// Space dimensions in mm

conf.dimensions = {};
conf.dimensions.x = 12651;
conf.dimensions.y = 6841;
conf.dimensions.z = 4255;

conf.spacesize_x = 12651;
conf.spacesize_y = 6841;
conf.spacesize_z = 4255;

conf.maxPlayers = 4;

conf.players = [
	{
		"r":255,
		"g":0,
		"b":0
	},
	{
		"r":0,
		"g":255,
		"b":0
	},
	{
		"r":0,
		"g":0,
		"b":255
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

conf.speakers = [
  [0,11359,1541], // 0
  [0,1258,1758], // 1
  [0,1272,5395], // 2
  [0,5341,1211], // 3
  [0,11318,5643], // 4 
  [0,3755,2118], // 5 
  [0,4553,5915], // 6
  [0,14651,3000], // 7 teine ruum
  [0,3032,6322], // 8
  [0,10433,3218], // 9
  [0,8856,5958], // 10
  [0,3755,3753], // 11
  [0,6301,5009], // 12
  [0,1258,3232], // 13
  [0,8912,2251], // 14
  [0,6000,3000] // 15 - bass

];
  conf.subwoofers = [
 
 ]


/////////////////////////////////////
// LED RGB Lights

// id, x, y
conf.lights = [
	[1,4],
	[6,4],
	[7,3],
	[8,0],
	[9,0],
	[10,1],	
	[11,1],
	[12,1],
	[13,1],
	[15,3],
	[16,2],
	[17,2],
	[18,3],
	[19,2]
	
];
