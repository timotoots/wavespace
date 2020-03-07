
////////////////////////////////////////////////////////////////////////

// Socket input

  var socket = io(conf.wavespace_server,{ transports: ['websocket', 'polling'] });

  socket.on('message', function(msg){
    console.log(msg);
    document.getElementById("message").innerHTML = msg;
  });

var players = [];

////////////////////////////////////////////////////////////////////////

  var speakersInSpace = [
  [0,12,20],
  [1,125,53],
  [2,196,12],
  [6,89,88],
  [7,30,105],
  [5,187,105]
  ];

var spaceDimensions = [210,140];

/*
var speakers = [];



for (var i = 0; i < speakersInSpace.length; i++) {

  speakers[i] = [];
  speakers[i][0] = mapValues(speakersInSpace[i][1],0,spaceDimensions[0],1,0);
  speakers[i][1] = mapValues(speakersInSpace[i][2],0,spaceDimensions[1],1,0);


}

  */



const button = document.querySelector('button');


////////////////////////////////////////////////////////////////////////

  // Sound init

  var context;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  context.destination.channelInterpretation = 'discrete';
  context.destination.channelCountMode = 'explicit';
  context.destination.channelCount = context.destination.maxChannelCount;

  Nexus.context = context;

  console.log("You sound card has " + context.destination.maxChannelCount  + " channels.")

  if(context.destination.maxChannelCount < conf.maxPlayers ){
    conf.maxPlayers  = context.destination.maxChannelCount;
  }


////////////////////////////////////////////////////////////////////////

// Speaker identification test

var testCounter = -1;

function testNextSpeaker(){

   testCounter++;
   playToSpeaker(testCounter);

   if(testCounter<16){
       setTimeout(function(){
        testNextSpeaker();
    },5000);
     } else {
      console.log("All speakers tested");
     }

}

function playToSpeaker(ch){

console.log("Test speaker" + ch);

for (var i = 0; i < players.length; i++) {

  players[i].audioElement.pause();

}

players[0].audioElement.src = 'data/'+ch+'.wav';

players[0].audioElement.play();

var msg = [1];

for (var i = 0; i < 16; i++) {

  if(i==ch){
    msg.push(1);
  } else {
    msg.push(0);
  }
}

socket.emit('message', msg.join(" "));




}
////////////////////////////////////////////////////////////////////////

function soundSendSpeakers(i,gains){

  if(typeof players[i] != "undefined"){


    players[i].multislider.setAllSliders(gains);

    gains.unshift(i+1);

    socket.emit('message', gains.join(" "));

  }


}

////////////////////////////////////////////////////////////////////////

// Init

document.addEventListener('DOMContentLoaded', function() {



	for (var i = 0; i < conf.maxPlayers; i++) {
		  createPlayer(i);
	}

  // testNextSpeaker();


});


/////////////////////////////////////////////////////////////////////////////////

function createPlayer(i){


  console.log("Create player " + i);

  players[i] = {"id":i,"audioElement":""};


  // Create wrapper div
  var div = document.createElement('div');
  div.id = 'player' + i;
  div.className = 'col-3 player border border-warning';
  document.getElementById("players").appendChild(div);


  div.insertAdjacentHTML('afterbegin','<div class="header">Player'+ i +'</div>');

  players[i].audioElement = document.createElement('audio');
  players[i].audioElement.src = 'data/speaker_test_aki/'+i+'.mp3';
  players[i].audioElement.id = "audioElement"+i
  players[i].audioElement.crossOrigin = 'anonymous';
  players[i].audioElement.autoplay = true;
  players[i].audioElement.loop = true;
  players[i].audioElement.style.display = "inline";

  players[i].audioElement.controls = true;
  div.appendChild(players[i].audioElement);

  // Audio routing from mono to separate output channels
  var source = context.createMediaElementSource(players[i].audioElement);
  var splitter = context.createChannelSplitter(2);
  var merger = context.createChannelMerger(conf.maxPlayers);
  source.connect(splitter);
  splitter.connect(merger, 0, i);
  merger.connect(context.destination);

   setTimeout(function(  ){
    players[i].audioElement.pause();
  },1000);

  ////////////////////////
  // UI Element: 2D Panner
/*
  var pan2d =  Nexus.Add.Pan2D('#player'+i,{
    'size': [spaceDimensions[0]*1,spaceDimensions[1]*1],
    'range': 0.4,  // detection radius of each speaker
    'mode': 'absolute',   // 'absolute' or 'relative' sound movement
    'speakers': speakers
    
  })

  pan2d.on('change',function(v) {
  
      // change volume sliders
      players[i].multislider.setAllSliders(v);

      v.unshift(i+1);
      socket.emit('message', v.join(" "));
      
     // console.log(v);

  });
*/
  //////////////////////
  // UI Element: Joystick

  var position =  Nexus.Add.Position('#player'+i,{
  'size': [100,100],
  'mode': 'absolute',  // "absolute" or "relative"
  'x': 0.5,  // initial x value
  'minX': 0,
  'maxX': 1,
  'stepX': 0,
  'y': 0.5,  // initial y value
  'minY': 0,
  'maxY': 1,
  'stepY': 0
});

  position.on('change',function(v) {

    spaceChangeSoundShape(i,"position_x",v.x);
    spaceChangeSoundShape(i,"position_y",v.y);

    // soundShapes[i].position.x = mapValues(v.x,0,1,0,conf.dimensions.x);
    // soundShapes[i].position.z = mapValues(v.y,0,1,0,conf.dimensions.y);
  

    // MovingCube.position.x = mapValues(v.x,0,1,0,conf.spacesize_x);
    // MovingCube.position.z = mapValues(v.y,0,1,0,conf.spacesize_y);

    //console.log(v);
  })

  //////////////////////
  // UI Element: VSlider

  var slider =  Nexus.Add.Slider('#player'+i,{
    'size': [20,120],
    'mode': 'absolute',  // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0,
  });

  slider.on('change',function(v) {

    spaceChangeSoundShape(i,"position_z",v);

    //console.log(v);
  })


  //////////////////////
  // UI Element: Dial Scale X

  var dial_scale_x =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_scale_x.on('change',function(v) {
    spaceChangeSoundShape(i,"scale_x",v);
  })

  //////////////////////
  // UI Element: Dial Scale Y

  var dial_scale_y =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_scale_y.on('change',function(v) {
    spaceChangeSoundShape(i,"scale_y",v);
  })

    //////////////////////
  // UI Element: Dial Scale Z

  var dial_scale_z =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_scale_z.on('change',function(v) {
    spaceChangeSoundShape(i,"scale_z",v);
  })







  //////////////////////
  // UI Element: Dial Orbit X

  var dial_orbit_x =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_orbit_x.on('change',function(v) {
    spaceChangeSoundShape(i,"orbit_x",v);
  })

  //////////////////////
  // UI Element: Dial Orbit Y

  var dial_orbit_y =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_orbit_y.on('change',function(v) {
    spaceChangeSoundShape(i,"orbit_y",v);
  })

    //////////////////////
  // UI Element: Dial Orbit Z

  var dial_orbit_z =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
  });

  dial_orbit_z.on('change',function(v) {
    spaceChangeSoundShape(i,"orbit_z",v);
  })


    //////////////////////
  // UI Element: Dial Orbit Speed

  var dial_orbit_speed =  Nexus.Add.Dial('#player'+i,{
    'size': [40,40],
    'interaction': 'vertical', // "radial", "vertical", or "horizontal"
    'mode': 'relative', // "absolute" or "relative"
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0.5
  });

  dial_orbit_speed.on('change',function(v) {
    spaceChangeSoundShape(i,"orbit_speed",v);
  })





//////////////////////

players[i].multislider =  Nexus.Add.Multislider('#player'+i,{
 'size': [200,100],
 'numberOfSliders': 5,
 'min': 0,
 'max': 1,
 'step': 0,
 'candycane': 3,
 'values': [0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1],
 'smoothing': 0,
 'mode': 'bar'  // 'bar' or 'line'
});

// var oscilloscope =  Nexus.Add.Spectrogram('#player'+i,{
//   'size': [300,150]
// })

// oscilloscope.connect(source);

}


/////////////////////////////////////////////////////////////////////////////////