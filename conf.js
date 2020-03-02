var conf = {};

var state = {};

var players = [];

// ch, x, y, z
conf.speakers = [
  [0,12,20],
  [1,125,53],
  [2,196,12],
  [6,89,88],
  [7,30,105],
  [5,187,105]
  ];

conf.lights = [
[0,100,100]
];

conf.mqtt = 'ws://mjkeskus.local:9001';
conf.wavespace_port = 3001;
conf.wavespace_server = 'http://localhost:' + conf.wavespace_port;



state.sounds = [
	{
		"id":0,
		"url":"test/test1.mp3",
		"state":"playing",
		"speaker_distances":[10,12,123],
		"light_distances":[12,12,11]
	},
	{
		"id":1,
		"url":"test/test2.mp3",
		"state":"playing",
		"speaker_distances":[10,12,123],
		"light_distances":[12,12,11]
	}
]


conf.spacesize_x = 2100;
conf.spacesize_y = 1400;
conf.spacesize_h = 400;
