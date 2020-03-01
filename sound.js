
////////////////////////////////////////////////////////////////////////

// Socket input

  var socket = io("http://localhost:3001",{ transports: ['websocket', 'polling'] });

  socket.on('message', function(msg){
    console.log(msg);
    document.getElementById("message").innerHTML = msg;
  });


////////////////////////////////////////////////////////////////////////

  var speakersInSpace = [
  [0,12,20],
  [1,125,53],
  [2,196,12],
  [6,89,88],
  [7,30,105],
  [5,187,105]
  ];

var speakers = [];

var spaceDimensions = [210,140];


for (var i = 0; i < speakersInSpace.length; i++) {

  speakers[i] = [];
  speakers[i][0] = mapValues(speakersInSpace[i][1],0,spaceDimensions[0],1,0);
  speakers[i][1] = mapValues(speakersInSpace[i][2],0,spaceDimensions[1],1,0);


}

  



const button = document.querySelector('button');


////////////////////////////////////////////////////////////////////////

  // Sound init

  var context;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  Nexus.context = context;

  var maxPlayers = 4;

  if(context.destination.maxChannelCount < maxPlayers){
    maxPlayers = context.destination.maxChannelCount;
  }


////////////////////////////////////////////////////////////////////////

// Speaker identification test

var testCounter = -1;

function testNextSpeaker(){

   testCounter++;
   playToSpeaker(testCounter);

   if(testCounter<8){
       setTimeout(function(){
        testNextSpeaker();
    },5000);
     } else {
      console.log("All speakers tested");
     }

}

////////////////////////////////////////////////////////////////////////

// Init

document.addEventListener('DOMContentLoaded', function() {


// testNextSpeaker();

	for (var i = 0; i < maxPlayers; i++) {
		  createPlayer(i);
	}


});


/////////////////////////////////////////////////////////////////////////////////

function createPlayer(i){


  console.log("Create player " + i);

  players[i] = {"id":i,"audioElement":""};


  // Create wrapper div
  var div = document.createElement('div');
  div.id = 'player' + i;
  div.className = 'block';
  div.style.float = 'left';
  div.style.padding = '1em';
  document.getElementById("players").appendChild(div);


  div.insertAdjacentHTML('afterbegin','<div class="header">Player'+ i +'</div>');

  players[i].audioElement = document.createElement('audio');
  players[i].audioElement.src = 'data/'+i+'.wav';
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
  var merger = context.createChannelMerger(maxPlayers);
  source.connect(splitter);
  splitter.connect(merger, 0, i);
  merger.connect(context.destination);

   setTimeout(function(  ){
    players[i].audioElement.pause();
  },1000);

  ////////////////////////
  // UI Element: 2D Panner

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



    MovingCube.position.x = mapValues(v.x,0,1,0,conf.spacesize_x);
    MovingCube.position.z = mapValues(v.y,0,1,0,conf.spacesize_y);

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
    'value': 0
});

  slider.on('change',function(v) {

    MovingCube.position.y = mapValues(v,0,1,0,conf.spacesize_h);

    //console.log(v);
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

// Helpful functions

function mapValues(value,in_min, in_max, out_min, out_max, rounded = false) {
    var val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    if(rounded==true){
        return Math.round(val);
    } else {
        val = toFixedNumber(val,3);
        return val;

    }
  
}

function toFixedNumber(number, digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(number*pow) / pow;
}

/////////////////////////////////////////////////////////////////////////////////