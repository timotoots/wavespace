////////////////////////////////////////////////////////////////////////

// Wavespace Server

// Routes messages between ESP32, web-browser and Pure Data.

////////////////////////////////////////////////////////////////////////


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});
var path = require('path');

 var colors = require('colors');


////////////////////////////////////////////////////////////////////////


var os = require("os");
var hostname = os.hostname();

hostname = hostname.replace('.local', '');

var conf = require('../conf/'+hostname+".js");
conf = conf.getConf();

conf.wavespace_server = 'http://'+hostname +".local:"+ conf.wavespace_port;

console.log(conf.wavespace_server);

// Start Pd

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
	
	io.emit('pdmessage', data);
	var i, l;
	data = data.slice(0, -2).split(' ');
	l = data.length;
	for (i = 0; i < l; i += 1){
		data[i] = +data[i];
	}
	
	// if (!!io) io.emit('message', data);
})
.create();

////////////////////////////////////////////////////////////////////////


var serialDevice = "/dev/tty.SLAB_USBtoUART";
var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

try{
	var serialport = new SerialPort(serialDevice, {
	  baudRate: 115200
	});

} catch(e){
  console.log("No device connected to " + serialDevice);
  process.exit();
}

var serialport_opened = false;

serialport.on('open', function(){
  console.log('Serial port1 opened'.green);
  if(serialport_opened==true){
  	//boot();
  }
  serialport_opened = true;
});

const parser = new Readline({delimiter: '\n'});
serialport.pipe(parser);


 parser.on('data', function(data){

   // DEBUG

   data = trim(data);
   if(data.substr(0,11) == "/controller"){

   	datas = data.split(":");
   	var out = {};
   	out["topic"] = trim(datas[0]);
   	out["payload"] = trim(datas[1]);
   	io.emit('serial-mqtt', out);
   	console.log(out);
   } else {
   	console.log(data.red);
   }

   

  // datas = data.split(":");

  // var data_spaces = data.split(" ");
   

});


////////////////////////////////////////////////////////////////////////
// Serve static files

app.use(express.static(path.join(__dirname, '../client'))); //  "public" off of current is root
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/data', express.static(path.join(__dirname, '../data')));

// Config for the client
app.get('/conf.js', function(req, res){

    res.setHeader('Content-Type', 'application/javascript');
    res.end('var conf=' + JSON.stringify(conf));

});



////////////////////////////////////////////////////////////////////////
// Socket connection

http.listen(conf.wavespace_port, function(){

  console.log('listening on *:'+conf.wavespace_port);

});

////////////////////////////////////////////////////////////////////////
//

io.on('connection', function(socket){


	socket.on('message', function(data){

	console.log("Data from browser: " + data);
	if(pd.isRunning()){
		console.log("Send to Pd: "+data);
		pd.write(data+';\n');
	}

	});


	// socket.on('disconnect', function(){
	// 	pd.destroy();
	// });


});
////////////////////////////////////////////////////////////////////////

if(conf.launchChrome){

	const chromeLauncher = require('chrome-launcher');

	const newFlags = chromeLauncher.Launcher.defaultFlags().filter(flag => flag !== '--mute-audio');

	newFlags.push("--kiosk");

	console.log(newFlags);
	/*
	chromeLauncher.launch({
	  startingUrl: 'https://google.com'
	}).then(chrome => {
	  console.log(`Chrome debugging port running on ${chrome.port}`);
	});
	*/
	chromeLauncher.launch({
	  ignoreDefaultFlags: true,
	  chromeFlags: newFlags,
	  startingUrl: conf.wavespace_server
	}).then(chrome => {
	  console.log(`Chrome debugging port running on ${chrome.port}`);
	});

}

if(conf.launchFirefox){

	var open = require("open");
	open(conf.wavespace_server, "firefox");

}

function trim(str){

  str = str.replace(/^\s+|\s+$/g,'');
  return str;

}

////////////////////////////////////////////////////////////////////////
// Testing
  /*
setInterval( function() {



  var msg = Math.random();
  io.emit('message', msg);
 // console.log (msg);

}, 1000);
  */

