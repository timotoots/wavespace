
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

conf.speakers = [  ];
for(y=0; y<4	;y++){

  for(x=0; x<3;x++){

		conf.speakers.push([0,3000+x*1500+3000,4600-y*1500+1000, "speaker"]);
	}
  }
  conf.speakers.push([0,100000,100000, "speaker"]);
  conf.speakers.push([0,100000,100000, "speaker"]);
  conf.speakers.push([0,100000,100000, "speaker"]);
  conf.speakers.push([0,100000,100000, "sub"]);

console.log(conf.speakers)
  /*
  Tartu Kunstimaja
conf.speakers = [
  [0,11330,1700, "speaker"], // 0 ok
  [0,1250,1750, "speaker"], // 1 ok
  [0,1250,5460, "speaker"], // 2 ok
  [0,5290,1160, "speaker"], // 3 ok
  [0,11330,5750, "speaker"], // 4 ok
  [0,6240,5040, "speaker"], // 5 ok
  [0,4510,5890, "speaker"], // 6 ok
  [0,14417,5280, "speaker"], // 7  -teine ruum
  [0,3730,2040, "speaker"], // 8 ok
  [0,10410,3230, "speaker"], // 9 ok
  [0,8800,5950, "speaker"], // 10 ok
  [0,3730,3670, "speaker"], // 11 ok
  [0,6240,2860, "speaker"], // 12 ok
  [0,1250,3300, "speaker"], // 13 ok
  [0,8800,2190, "speaker"], // 14 ok
  [0,4900,2400, "sub"] // 15 ok - bass

];
*/
  conf.subwoofers = [
 
 ]


/////////////////////////////////////
// LED RGB Lights

// id, x, y
// not used 	[6,4], 

conf.lights = [
	[12,0],
	[9,0],
	[8,0],
	[13,1],
	[19,2],
	[15,3],
	[18,4],
	[17,4],	
	[11,4]
	
];
