////////////////////////////////////////////////////////////////////////

// Wavespace Server

// Routes messages between ESP32, web-browser and Pure Data.

////////////////////////////////////////////////////////////////////////


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});

////////////////////////////////////////////////////////////////////////
// Start Pd

var port = require('port');

var pd = port({
		'read': 8005,
		'write': 8006,
		'encoding': 'ascii',
		'basepath': __dirname,
		'pd':'/Applications/Pd-0.50-0.app/Contents/Resources/bin/pd',
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

app.get('/', function(req, res){

  //send the index.html file for all requests
  res.sendFile(__dirname + '/index.html');

});


////////////////////////////////////////////////////////////////////////
// Socket connection

http.listen(3001, function(){

  console.log('listening on *:3001');

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

