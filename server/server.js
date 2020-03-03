////////////////////////////////////////////////////////////////////////

// Wavespace Server

// Routes messages between ESP32, web-browser and Pure Data.

////////////////////////////////////////////////////////////////////////


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});
var path = require('path');

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

var pd = port({
		'read': 8005,
		'write': 8006,
		'encoding': 'ascii',
		'basepath': __dirname,
		'pd':conf.pdBin,
		'flags': {
			'noprefs': true,
			'stderr': true,
			'send': 'pd dsp 0, dsp 1',
			'inchannels':'4',
			'outchannels':'16',
			'audioindev':'2',
			'open': './mixer.pd'

		}
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
// Testing
  /*
setInterval( function() {



  var msg = Math.random();
  io.emit('message', msg);
 // console.log (msg);

}, 1000);
  */

