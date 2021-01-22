////////////////////////////////////////////////////////////////////////

// Wavespace Sound Player

// Multichannel Audio player
// Plays 8 mono tracks through Jack to PureData

// Controller: pause, volume, soundfile


////////////////////////////////////////////////////////////////////////

var players = [];

conf.maxPlayers = 8;

////////////////////////////////////////////////////////////////////////

var currentBackground = -1;
var backgroundStatus = "stopped";

var backgrounds = []


// https://coolors.co


var out = {
  'name':'Test 0+1+2+3',
  'colors':["3d315b","444b6e","708b75","9ab87a","f8f991"],
  'status':'stopped',
  'sounds':{
    'speaker_test_aki/0.mp3':0,
    'speaker_test_aki/1.mp3':1,
    'speaker_test_aki/2.mp3':2,
    'speaker_test_aki/3.mp3':3
  }
}

backgrounds.push(out);


var out = {
  'name':'Test 4+5+6+7',
  'colors':["8cff98","aad922","6f7c12","483519","000000"],
  'status':'stopped',
  'sounds':{
    'speaker_test_aki/4.mp3':4,
    'speaker_test_aki/5.mp3':5,
    'speaker_test_aki/6.mp3':6,
    'speaker_test_aki/7.mp3':7
  }
}

backgrounds.push(out);


var out = {
  'name':'Test 8+9+10+11',
  'colors':["fcaa67","b0413e","ffffc7","548687","473335"],
  'status':'stopped',
  'sounds':{
    'speaker_test_aki/8.mp3':8,
    'speaker_test_aki/9.mp3':9,
    'speaker_test_aki/10.mp3':10,
    'speaker_test_aki/11.mp3':11
  }
}

backgrounds.push(out);

var out = {
  'name':'Test 12+13+14+15',
  'colors':["f4e409","eeba0b","c36f09","a63c06","710000"],
  'status':'stopped',
  'sounds':{
    'speaker_test_aki/12.mp3':12,
    'speaker_test_aki/13.mp3':13,
    'speaker_test_aki/14.mp3':14,
    'speaker_test_aki/15.mp3':15
  }
}

backgrounds.push(out);


///////////////////////////////////////

var out = {
  'name':'SCAPE1',
  'colors':["258ea6","549f93","9faf90","e2b1b1","e2c2ff"],
  'status':'stopped',
  'sounds':{
    'taustad_v2/taust1/1.wav':1,
    'taustad_v2/taust1/2.wav':2,
    'taustad_v2/taust1/3.wav':4,
    'taustad_v2/taust1/4.wav':0
  }
}

backgrounds.push(out);

///////////////////////////////////////

var out = {
  'name':'SCAPE2',
  'colors':["cee0dc","b9cfd4","afaab9","b48291","a5243d"],
  'status':'stopped',
  'sounds':{
    'taustad_v2/taust2/1.wav':1,
    'taustad_v2/taust2/2.wav':2,
    'taustad_v2/taust2/3.wav':4,
    'taustad_v2/taust2/4.wav':0
  }
}

backgrounds.push(out);


///////////////////////////////////////

var out = {
  'name':'SCAPE3',
  'colors':["e08dac","6a7fdb","57e2e5","45cb85","153131"],
  'status':'stopped',
  'sounds':{
    'taustad_v2/taust3/1.wav':1,
    'taustad_v2/taust3/2.wav':2,
    'taustad_v2/taust3/3.wav':4,
    'taustad_v2/taust3/4.wav':0
  }
}

backgrounds.push(out);

///////////////////////////////////////

var out = {
  'name':'SCAPE4',
  'colors':["f4e409","eeba0b","c36f09","a63c06","710000"],
  'status':'stopped',
  'sounds':{
    'taustad_v2/taust4/1.wav':1,
    'taustad_v2/taust4/2.wav':2,
    'taustad_v2/taust4/3.wav':4,
    'taustad_v2/taust4/4.wav':0
  }
}

backgrounds.push(out);



function playBackground(i){

  if(currentBackground!=i){

    for (var  k= 0; k < backgrounds.length; k++) {
      $("#background_icon" + k).removeClass("rotating");
    }

    var player_id = 4;
    for(var file in backgrounds[i].sounds){

      players[player_id].audioElement.src = "../data/" + file;
      players[player_id].audioElement.play();

      var msg = [player_id+1];

      for (var j = 0; j < conf.speakers.length; j++) {
        
           if(j==backgrounds[i].sounds[file] || j==15){
              msg.push(1);
            } else {
              msg.push(0);
            } 
      }

      sendMqtt("/speaker_gains/"+player_id,  msg.join(" "));

      player_id++;

    } // for 

    currentBackground = i;

    $("#background_icon" + i).addClass("rotating");

    
    changeLed(1,"00000080");


    for(var light_id in backgrounds[i].lights){
       changeLed(light_id,backgrounds[i].lights[light_id]);
    }



    // when clicked on active one
  } else {

    for (var  k= 0; k < backgrounds.length; k++) {
      $("#background_icon" + k).removeClass("rotating");
    }

    var player_id = 4;
    for(var file in backgrounds[i].sounds){

      players[player_id].audioElement.src = "";

      var msg = [player_id+1];

      for (var j = 0; j < conf.speakers.length; j++) {
        
           if(j==backgrounds[i].sounds[file] || j==15){
              msg.push(0);
            } else {
              msg.push(0);
            } 
      }

      sendMqtt("/speaker_gains/"+player_id,  msg.join(" "));

      player_id++;

    } // for 

    currentBackground = -1;

  }


}

function createBackground(i){


    console.log("Create background " + i);


    // Create wrapper div
    var div = document.createElement('div');
    div.id = 'background' + i;
    div.className = 'background';
    document.getElementById("backgrounds").appendChild(div);

    $("#background" + i).click(function() {
      var id = this.id.replace("background","");
      playBackground(i);
    });

    // COLORS

    backgrounds[i].lights = {};

    for (var r = 0; r < conf.lights .length; r++) {
      
        var light_id = conf.lights[r][0];
        var group_id = conf.lights[r][1];

        if(group_id==0){
          backgrounds[i].lights[light_id] = backgrounds[i].colors[0];
        } else if(group_id==1){
          backgrounds[i].lights[light_id] = backgrounds[i].colors[1];
        } else if(group_id==2){
          backgrounds[i].lights[light_id] = backgrounds[i].colors[2];
        } else if(group_id==3){
          backgrounds[i].lights[light_id] = backgrounds[i].colors[3];
        } else if(group_id==4){
          backgrounds[i].lights[light_id] = backgrounds[i].colors[4];
        }

    }

    console.log(backgrounds[i].lights);

    var wheel = 'background: conic-gradient(';
    deg = 100/backgrounds[i].colors.length;

    for(var col in backgrounds[i].colors){
      wheel += "#" + backgrounds[i].colors[col] +","
    }

    wheel = wheel.substring(0, wheel.length - 1);

    wheel += ")";


    div.insertAdjacentHTML('afterbegin',`

      <div class="background_icon" style="${wheel}"  id="background_icon${i}"></div>
      <div class="main_header" id="header${i}">${backgrounds[i].name}</div>
     

      `);


}


////////////////////////////////////////////////////////////////////////

var last_paused_1 = new Date().getTime();
var last_paused_2 = new Date().getTime();
var last_paused_3 = new Date().getTime();
var last_paused_4 = new Date().getTime();

////////////////////////////////////////////////////////////////////////

function parseMqtt(topic, message){


  topic = topic.split("/");

  if(topic[1]=="hardcontroller" && topic[2]>=1 && topic[2]<=4 && topic[3]){ //  && document.getElementById('mqtt_update').checked==true

      var now = new Date().getTime();

      var controller = topic[2]-1

      // if(topic[3]=="PAUSE"){


      //   if (players[controller].audioElement.duration > 0 && !players[controller].audioElement.paused ) {
      //       players[controller].audioElement.pause();
      //       console.log("Pause player" + (controller+1));
      //   } else {
      //       players[controller].audioElement.play();
      //       console.log("Play player" + (controller+1));
      //   }


      // }  else 

      if(topic[4]=="POS_Z"){

          players[controller].audioElement.volume = mapValues(message,255, 0, 0, 1);


      } else if(topic[4]=="TAG_ON"){

          console.log("Play player " + controller+": " + message);
          players[controller].audioElement.src = "../data/linkid_v1/" + message + ".wav"
          players[controller].audioElement.play();

          var ledColors = {};
          ledColors[0] = "100 0 0";
          ledColors[1] = "0 100 0";
          ledColors[2] = "0 0 100";
          ledColors[3] = "100 100 0";
         

           sendMqtt("/set_controller/"+ (controller+10001) + "/led/0",  ledColors[controller]+" 0" );

                    // set_controller



      } else if(topic[4]=="TAG_OFF"){

          console.log("Stop player " + controller);
          players[controller].audioElement.src = ""
          players[controller].audioElement.pause();

          sendMqtt("/set_controller/"+ (controller+10001) + "/led/0",  "0 0 0 0" );


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
    },30000);
     } else {
      console.log("All speakers tested");
     }

}

function playToSpeaker(ch){

console.log("Test speaker" + ch);

for (var i = 0; i < players.length; i++) {

  players[i].audioElement.pause();

}

players[0].audioElement.src = '../data/helid2/'+ch+'.wav';

players[0].audioElement.play();

var msg = [1];

for (var i = 0; i < 16; i++) {

  if(i==ch){
    msg.push(1);
  } else {
    msg.push(0);
  }
}

      sendMqtt("/speaker_gains/"+i,  msg.join(" "));




 

}


////////////////////////////////////////////////////////////////////////

// Init

document.addEventListener('DOMContentLoaded', function() {





	for (var i = 0; i < conf.maxPlayers; i++) {
		  createPlayer(i);
	}

  for (var i = 0; i < backgrounds.length; i++) {
      createBackground(i);
  }

    // testNextSpeaker(); 


});




/////////////////////////////////////////////////////////////////////////////////

var channelMappingJack = [0,1,4,5,2,3,6,7];

// browser -> pulseaudio
/*
0: L: left
1: R: right
2: C: center
3: LFE: subwoofer
4: SL: surround left
5: SR: surround right
*/

// in jack:
// pulseaudio -> pure_data
// front-center - 4
// front-left - 0
// front-right - 1
// lfe - 5
// rear-left - 2
// rear-right - 3
// side-left - 6 
// side-right - 7




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
  // players[i].audioElement.src = '../data/speaker_test_aki/'+i+'.mp3';
  players[i].audioElement.src = '../data/helid2/'+i+'.wav';


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
  splitter.connect(merger, 0, channelMappingJack[i]); // map to jack channels
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



