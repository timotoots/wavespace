////////////////////////////////////////////////////////////////////////

// Wavespace Sound Player

// Multichannel Audio player
// Plays 8 mono tracks through Jack to PureData

// Controller: pause, volume, soundfile


////////////////////////////////////////////////////////////////////////

var players = [];

conf.maxPlayers = 4;

////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////

var last_paused_1 = new Date().getTime();
var last_paused_2 = new Date().getTime();
var last_paused_3 = new Date().getTime();
var last_paused_4 = new Date().getTime();

////////////////////////////////////////////////////////////////////////

function parseMqtt(topic, message){


  topic = topic.split("/");
  console.log(topic);

  if(topic[1]=="softcontroller" && topic[2]>0 &&  topic[2]<4 && topic[3]){ //  && document.getElementById('mqtt_update').checked==true

      var now = new Date().getTime();



    if( topic[2]==1){
      var controller = 0;
      if(now - last_paused_1 < 1000 && topic[3]=="PAUSE"){
          return false;
      }

        last_paused_1 = now;
    } else if(topic[2]=="2" ){
      var controller = 1;
      if(now - last_paused_2 < 1000  && topic[3]=="PAUSE"){
          return false;
      }
       last_paused_2 = now;

          } else if(topic[2]=="3" ){
      var controller = 2;
 
       if(now - last_paused_3 < 1000  && topic[3]=="PAUSE"){
          return false;
      }

      last_paused_3 = now;

         } else if(topic[3]=="4" ){
      var controller = 3;
 
       if(now - last_paused_4 < 1000  && topic[3]=="PAUSE"){
          return false;
      }
       last_paused_4 = now;

         }

      if(topic[3]=="PAUSE"){


        if (players[controller].audioElement.duration > 0 && !players[controller].audioElement.paused ) {
            players[controller].audioElement.pause();
            console.log("Pause player" + (controller+1));
        } else {
            players[controller].audioElement.play();
            console.log("Play player" + (controller+1));
        }


      }  else if(topic[3]=="VOLUME"){

          players[controller].audioElement.volume = mapValues(message,0, 255, 0, 1);


      } else if(topic[3]=="tag_on"){

          players[controller].audioElement.volume = mapValues(message,0, 255, 0, 1);


      }

  }

  }

////////////////////////////////////////////////////////////////////////

  // Sound init

  var context;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  context.destination.channelInterpretation = 'discrete';
  context.destination.channelCountMode = 'explicit';
  context.destination.channelCount = context.destination.maxChannelCount;


  console.log("You sound card has " + context.destination.maxChannelCount  + " channels.")

  if(context.destination.maxChannelCount < conf.maxPlayers ){
    // conf.maxPlayers  = context.destination.maxChannelCount;
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

players[0].audioElement.src = '../data/'+ch+'.wav';

players[0].audioElement.play();

var msg = [1];

for (var i = 0; i < 16; i++) {

  if(i==ch){
    msg.push(1);
  } else {
    msg.push(0);
  }
}

// socket.emit('message', msg.join(" "));




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
  players[i].audioElement.src = '../data/speaker_test_aki/'+i+'.mp3';
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
     // setDefaults();
  },1000);


// var oscilloscope =  Nexus.Add.Spectrogram('#player'+i,{
//   'size': [300,150]
// })

// oscilloscope.connect(source);

}


/////////////////////////////////////////////////////////////////////////////////



