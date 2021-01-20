
var players = [];

conf.maxPlayers = 4;

////////////////////////////////////////////////////////////////////////

// Init
var dial_size = 60;

document.addEventListener('DOMContentLoaded', function() {



for (var i = 0; i < conf.maxPlayers; i++) {
	  createPlayer(i);
}

  sendMqtt("/hardcontroller_publish_all/10001", "")
  sendMqtt("/hardcontroller_publish_all/10002", "")
  sendMqtt("/hardcontroller_publish_all/10003", "")
  sendMqtt("/hardcontroller_publish_all/10004", "")




});






function parseMqtt(topic, message){


  topic = topic.split("/");

  if((topic[1]=="hardcontroller") && document.getElementById('mqtt_update').checked==true){

    if(topic[2]>=1 && topic[2]<=4 ){
      var controller = topic[2]-1;
    } 

    var key = topic[4];

      if(key=="POS_X"){
          players[controller].position.x = message;
      } else if(key=="POS_Y"){
          players[controller].position.y = message;
      } else if(key=="POS_Z"){
          players[controller].slider_pos_z.value = message;
      } else if(key=="ORBIT_WIDTH"){
          players[controller].dial_orbit_width.value = message;
      } else if(key=="ORBIT_LENGTH"){
          players[controller].dial_orbit_length.value = message;
      } else if(key=="ORBIT_ROTATE"){
          players[controller].dial_orbit_rotate.value = message;
      } else if(key=="ORBIT_SPEED"){
          players[controller].dial_orbit_speed.value = message;
      } else if(key=="SHAPE_WIDTH"){
          players[controller].dial_shape_width.value = message;
      } else if(key=="SHAPE_LENGTH"){
          players[controller].dial_shape_length.value = message;
      } else if(key=="SHAPE_HEIGHT"){
          players[controller].dial_shape_height.value = message;
      } else if(key=="SHAPE_BLUR"){
          players[controller].dial_shape_blur.value = message;
      } else if(key=="VOLUME"){
          players[controller].dial_volume.value = message;
      } else if(key=="TAG_ON"){
          players[controller].tag.value = message;
      } else if(key=="TAG_OFF"){
          players[controller].tag.value = '';
      }

    console.log(message);
  } else if(topic[1]=="speaker_gains"){
    
     if(topic[2]>=1 && topic[2]<=4 ){
      var controller = topic[2]-1;
             players[controller].multislider.setAllSliders(message.split(" "));

    } 

    console.log(message);


  }


  }




function setDefaults(){

  var controller = 0;

//  players[controller].position.x = 0.31
//  players[controller].position.y =  0.35
// players[controller].dial_orbit_x.value =  0.12
// players[controller].dial_orbit_y.value = 0.12
// players[controller].dial_orbit_z.value  = 0.25
// players[controller].dial_orbit_speed.value = 0.52
// players[controller].dial_scale_x.value =  0.005
// players[controller].dial_scale_y.value =  0.005
// players[controller].dial_scale_z.value = 0.005



}

/////////////////////////////////////////////////////////////////////////////////

function spaceChangeSoundShape(controller, key, value){


  sendMqtt("/softcontroller/"+(controller+1)+"/"+key+"", value.toString())


}

function createPlayer(i){


    console.log("Create player " + i);

    players[i] = {"id":i};

    // Create wrapper div
    var div = document.createElement('div');
    div.id = 'player' + i;
    div.className = 'player';
    document.getElementById("players").appendChild(div);

    div.insertAdjacentHTML('afterbegin',`

      <div class="main_header" id="header${i}">CONTROLLER ${i+1}</div>
      <hr/>

      <div class="dial_header">SOUND</div>
      <div id="sound${i}" class="sound"></div>

      <div class="dial_header">POSITION</div>
      <div id="pos${i}" class="pos"></div>

      <div class="dial_header">ORBIT</div>
      <div id="orbit${i}" class="orbit"></div>

      <div class="dial_header">SHAPE</div>
      <div id="shape${i}" class="shape"></div>

      <hr/>
      <div class="dial_header">MONITOR</div>

      `);
   
    //  setTimeout(function(  ){
    //    setDefaults();
    // },1000);



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

    /////////////////////////////////////////////////////////////////////////////////////
    // HEADER

     players[i].rgb =  Nexus.Add.Button('#header'+i,{
      'size': [dial_size/2,dial_size/2],
      'mode': 'aftertouch',
      'state': false,

    }); 

    players[i].rgb.colorize("fill","#ff0") 

    /////////////////////////////////////////////////////////////////////////////////////
    // SOUND

    players[i].tag = new Nexus.Select('#sound'+i,{
      'size': [250,30],
      'options': ['','04-C0-C7-7A-E0-60-80','04-33-C2-7A-E0-60-80','04-A1-C5-7A-E0-60-80','04-18-C8-7A-E0-60-81']
    })

    /////////////////////////////////////////////////////////////////////////////////////
    // POSITION

    players[i].position =  Nexus.Add.Position('#pos'+i,{
      'size': [100,100],
      'mode': 'absolute',  // "absolute" or "relative"
      'x': 128,  // initial x value
      'minX': 0,
      'maxX': 255,
      'stepX': 0,
      'y': 128,  // initial y value
      'minY': 0,
      'maxY': 255,
      'stepY': 0
    });


    players[i].slider_pos_z =  Nexus.Add.Slider('#pos'+i,{
      'size': [20,100],
      'mode': 'absolute',  // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0,
    });

    players[i].position.on('change',function(v) {
      spaceChangeSoundShape(i,"POS_X",Math.round(v.x));
      spaceChangeSoundShape(i,"POS_Y",Math.round(v.y));
    })

    players[i].slider_pos_z.on('change',function(v) {
      spaceChangeSoundShape(i,"POS_Z",Math.round(v));
    })


    /////////////////////////////////////////////////////////////////////////////////////
    // AUDIO

     players[i].dial_volume =  Nexus.Add.Dial('#pos'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    }); 


     players[i].pause =  Nexus.Add.Button('#pos'+i,{
      'size': [dial_size,dial_size],
      'mode': 'button',
      'state': false
    }); 


    players[i].dial_volume.on('change',function(v) {
      spaceChangeSoundShape(i,"VOLUME",Math.round(v));
    })
    
    players[i].pause.on('change',function(v) {
      spaceChangeSoundShape(i,"PAUSE","ON");
    })

    /////////////////////////////////////////////////////////////////////////////////////
    // SHAPE

    players[i].dial_shape_width =  Nexus.Add.Dial('#shape'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_shape_length =  Nexus.Add.Dial('#shape'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });
    
    players[i].dial_shape_height =  Nexus.Add.Dial('#shape'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_shape_blur =  Nexus.Add.Dial('#shape'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_shape_width.on('change',function(v) {
      spaceChangeSoundShape(i,"SHAPE_WIDTH",Math.round(v));
    })
    players[i].dial_shape_length.on('change',function(v) {
      spaceChangeSoundShape(i,"SHAPE_LENGTH",Math.round(v));
    })
    players[i].dial_shape_height.on('change',function(v) {
      spaceChangeSoundShape(i,"SHAPE_HEIGHT",Math.round(v));
    })
    players[i].dial_shape_blur.on('change',function(v) {
      spaceChangeSoundShape(i,"SHAPE_BLUR",Math.round(v));
    })

    /////////////////////////////////////////////////////////////////////////////////////
    // ORBIT

    players[i].dial_orbit_width =  Nexus.Add.Dial('#orbit'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_orbit_length =  Nexus.Add.Dial('#orbit'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_orbit_rotate =  Nexus.Add.Dial('#orbit'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 0
    });

    players[i].dial_orbit_speed =  Nexus.Add.Dial('#orbit'+i,{
      'size': [dial_size,dial_size],
      'interaction': 'vertical', // "radial", "vertical", or "horizontal"
      'mode': 'relative', // "absolute" or "relative"
      'min': 0,
      'max': 255,
      'step': 0,
      'value': 128
    });


    players[i].dial_orbit_width.on('change',function(v) {
      spaceChangeSoundShape(i,"ORBIT_WIDTH",Math.round(v));
    })

    players[i].dial_orbit_length.on('change',function(v) {
      spaceChangeSoundShape(i,"ORBIT_LENGTH",Math.round(v));
    })

    players[i].dial_orbit_rotate.on('change',function(v) {
      spaceChangeSoundShape(i,"ORBIT_ROTATE",Math.round(v));
    })

    players[i].dial_orbit_speed.on('change',function(v) {
      spaceChangeSoundShape(i,"ORBIT_SPEED",Math.round(v));
    })


    /////////////////////////////////////////////////////////////////////////////////////
    // FEEDBACK


    players[i].multislider =  Nexus.Add.Multislider('#player'+i,{
     'size': [200,100],
     'numberOfSliders': 6,
     'min': 0,
     'max': 1,
     'step': 0,
     'candycane': 3,
     'values': [0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0],
     'smoothing': 0,
     'mode': 'bar'  // 'bar' or 'line'
    });

  } // createPlayer


/////////////////////////////////////////////////////////////////////////////////