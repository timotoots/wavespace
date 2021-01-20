////////////////////////////////////////////////////////////////////////

// Wavespace Server

// Routes messages between ESP32, web-browser and Pure Data.

////////////////////////////////////////////////////////////////////////

var colors = require('colors');


var mqtt_prepend = "wavespace";
var mqtt_server = "wavespace.local";
var mqtt_user = ""
var mqtt_pass = ""

var conf = {}
conf.launchPd = true;
conf.pdNoGui = false;
conf.pdAudioApi = "jack"
conf.pdBin = "/usr/bin/puredata";

console.log("Started");


////////////////////////////////////////////////////////////////////////

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://'+mqtt_server,{"username":mqtt_user,"password":mqtt_pass})

client.on('connect', function () {

  client.subscribe('wavespace/speaker_gains/#', function (err) {
    if (!err) {
      client.publish('wavespace/mixer', 'mixer started')
      console.log("subscribed");
    }
  }) 
})

client.on('message', function (topic, message) {
	parseMqtt(topic, message.toString());
})


function sendMqtt(topic, value){

	topic = mqtt_prepend + topic;

	console.log("[MQTT] Send to topic " + topic.green + ", value: '" + value + "'")

    client.publish(topic, value)

}

////////////////////////////////////////////////////////////////////////


function parseMqtt(topic, message){

	
  topic = topic.split("/");

  if(topic[1]=="speaker_gains" && topic[2]){

		if(conf.launchPd){

				if(pd.isRunning()){
					console.log("Send to Pd: "+message);
					pd.write(message+';\n');
				}
			}
			console.log(message)

  }



}


////////////////////////////////////////////////////////////////////////

// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var path = require('path');




////////////////////////////////////////////////////////////////////////


// var os = require("os");
// var hostname = os.hostname();

// hostname = hostname.replace('.local', '');


// Start Pd


if(conf.launchPd == true){

	var port = require('port');

	var pdFlags = {
				'noprefs': true,
				'stderr': true,
				'nogui': conf.pdNoGui,
				'send': 'pd dsp 0, dsp 1',
				'inchannels':'8',
				'outchannels':'16',
				'open': './mixer.pd'

			};

	if(conf.pdAudioApi){
		pdFlags[conf.pdAudioApi] = true;
	}




	var pd = port({
			'read': 8005,
			'write': 8006,
			'encoding': 'ascii',
			'basepath': __dirname,
			'pd':conf.pdBin,
			'flags': pdFlags
	})

	.on('connect', function(){
		this.write('run 1;\n');
		this.write('Pd started;\n');

	})

	.on('stderr', function(buffer){
		console.log(buffer.toString());
	})

	.on('data', function(data){

		console.log(data);

		sendMqtt("/pd", data)
		
		// io.emit('pdmessage', data);
		// var i, l;
		// data = data.slice(0, -2).split(' ');
		// l = data.length;
		// for (i = 0; i < l; i += 1){
		// 	data[i] = +data[i];
		// }
		
	})
	.create();


}



////////////////////////////////////////////////////////////////////////
// Serve static files

// app.use(express.static(path.join(__dirname, '../client'))); //  "public" off of current is root
// app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
// app.use('/data', express.static(path.join(__dirname, '../data')));

// // Config for the client
// app.get('/conf.js', function(req, res){

//     res.setHeader('Content-Type', 'application/javascript');
//     res.end('var conf=' + JSON.stringify(conf));

// });





////////////////////////////////////////////////////////////////////////

function trim(str){

  str = str.replace(/^\s+|\s+$/g,'');
  return str;

}


