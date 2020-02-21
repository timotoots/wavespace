
function mapValues(value,in_min, in_max, out_min, out_max, rounded = false) {
    var val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    if(rounded==true){
        return Math.round(val);
    } else {
        val = val.toFixedNumber(3);
        return val;

    }
  
}

Number.prototype.toFixedNumber = function(digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(this*pow) / pow;
}

  var position = new Nexus.Position('#instrument',{
  'size': [200,200],
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

console.log(speakers);

// [0.5,0.2],
//       [0.75,0.25],
//       [0.8,0.5],
//       [0.75,0.75],
//       [0.5,0.8],
//       [0.25,0.75],
//       [0.2,0.5],
//       [0.25,0.25]

var pan2d = new Nexus.Pan2D('#instrument2',{
  'size': [spaceDimensions[0]*2,spaceDimensions[1]*2],
  'range': 0.1,  // detection radius of each speaker
  'mode': 'absolute',   // 'absolute' or 'relative' sound movement
  'speakers': speakers
  
})

position.on('change',function(v) {
  console.log(v);
})

pan2d.on('change',function(v) {
  
  console.log(v);

  for (var i = 0; i < v.length; i++) {

    var channelNumber = speakersInSpace[i][0];
    
    document.querySelector('#gain_spk'+ channelNumber +'_slider').value = v[i];
    console.log(channelNumber);
    gains[channelNumber].gain.value = v[i];

  }


  /*
  gainout1.gain.value = v[0]
  gainout2.gain.value = v[1]
  gainout3.gain.value = v[2]
  gainout4.gain.value = v[3]
  gainout5.gain.value = v[4]
  gainout6.gain.value = v[5]
  */

  // gainout7.gain.value = v[6]
  // gainout8.gain.value = v[7]
})





const button = document.querySelector('button');


  var context;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

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

document.addEventListener('DOMContentLoaded', function() {

 testNextSpeaker();

	for (var i = 0; i < context.destination.maxChannelCount; i++) {
		 // playToSpeaker(i);
	}


});




var maxChannelCount = context.destination.maxChannelCount;

console.log(maxChannelCount);


  context.destination.channelInterpretation = 'discrete';
context.destination.channelCountMode = 'explicit';
context.destination.channelCount = maxChannelCount;

      //create a source node to capture the audio from your video element
source = context.createMediaElementSource(document.querySelector('audio'));

//Create the splitter and the merger
splitter = context.createChannelSplitter(2);
merger = context.createChannelMerger(maxChannelCount);

  merger.channelInterpretation = 'discrete';


//route the source audio to the splitter. This is a stereo connection.
source.connect(splitter);

var gains = [];

for (var i = 0; i < maxChannelCount; i++) {

 gains[i] = context.createGain();
 gains[i].gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gains[i], 0, 0);
 gains[i].connect(merger, 0, i);

}

/*
 var gainout1 = context.createGain();
 gainout1.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout1, 0, 0);
 gainout1.connect(merger, 0, 0);


 var gainout2 = context.createGain();
 gainout2.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout2, 0, 0);
 gainout2.connect(merger, 0, 1);


 var gainout3 = context.createGain();
 gainout3.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout3, 0, 0);
 gainout3.connect(merger, 0, 2);


 var gainout4 = context.createGain();
 gainout4.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout4, 0, 0);
 gainout4.connect(merger, 0, 3);

 var gainout5 = context.createGain();
 gainout5.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout5, 0, 0);
 gainout5.connect(merger, 0, 4);

 var gainout6 = context.createGain();
 gainout6.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout6, 0, 0);
 gainout6.connect(merger, 0, 5);


 var gainout7 = context.createGain();
 gainout7.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout7, 0, 0);
 gainout7.connect(merger, 0, 6);


  var gainout8 = context.createGain();
 gainout8.gain.setValueAtTime(0.1, context.currentTime);
 splitter.connect(gainout8, 0, 0);
 gainout8.connect(merger, 0, 7);

*/

 // var gain_spk1_input = document.querySelector('#gain_spk1_slider');
 // var gain_spk2_input = document.querySelector('#gain_spk2_slider');
 // var gain_spk3_input = document.querySelector('#gain_spk3_slider');
 // var gain_spk4_input = document.querySelector('#gain_spk4_slider');


  // gain_spk1_input.oninput = function(){gainout1.gain.value = this.value}
  // gain_spk2_input.oninput = function(){gainout2.gain.value = this.value}
  // gain_spk3_input.oninput = function(){gainout3.gain.value = this.value}
  // gain_spk4_input.oninput = function(){gainout4.gain.value = this.value}




//route output 0 (left) from the splitter to input 0 (left) on the merger. This is a mono connection, carrying the left output signal to the left input of the Merger.
//route output 0 (left) from the splitter to input 1 (right) on the merger. This is a mono connection as well, carrying the left output signal to the right input of the Merger.
// splitter.connect(merger, 0, 1)
//splitter.connect(merger, 0, 1);






//finally, connect the merger to the destination. This is a stereo connection.
merger.connect(context.destination);



function playToSpeaker(i){

console.log("Play test to speaker" + i);

  let audio = document.createElement('audio');
  audio.src = 'age.wav';
  audio.src = 'data/'+i+'.mp3';
  audio.crossOrigin = 'anonymous';
  audio.autoplay = true;
  audio.loop = true;
  var source = context.createMediaElementSource(audio);
  var splitter = context.createChannelSplitter(2);
  var merger = context.createChannelMerger(maxChannelCount);
  source.connect(splitter);
  splitter.connect(merger, 0, i);
  merger.connect(context.destination);
  setTimeout(function(  ){
  	audio.pause();
  },1000);
}