
/////////////////////////////////////////////////
//
// Serial to MQTT bridge
//
/////////////////////////////////////////////////

// configuration


let NodeMonkey = require("node-monkey")
let monkey = NodeMonkey({
  server: {
    disableLocalOutput: false,
    port:5001
  },
})

var tags = {};

tags["04-FF-C7-7A-E0-60-80"] = "macondo";
tags["04-F7-C7-7A-E0-60-80"] = "cockaigne";
tags["04-F0-C6-7A-E0-60-80"] = "lytreia";
tags["04-E8-C5-7A-E0-60-80"] = "lituania";
tags["04-CF-C5-7A-E0-60-80"] = "pentixore";
tags["04-C7-C5-7A-E0-60-80"] = "luquebaralideaux";
tags["04-C0-C4-7A-E0-60-80"] = "spensonia";
tags["04-B9-C3-7A-E0-60-80"] = "meccainia";
tags["04-B1-C3-7A-E0-60-80"] = "euphonia";
tags["04-A9-C3-7A-E0-60-80"] = "sarragalla";
tags["04-A1-C3-7A-E0-60-80"] = "fionavar";
tags["04-99-C3-7A-E0-60-80"] = "papefiguiera";
tags["04-91-C3-7A-E0-60-80"] = "maina";
tags["04-89-C3-7A-E0-60-80"] = "antagil";
tags["04-81-C3-7A-E0-60-80"] = "butua";
tags["04-79-C2-7A-E0-60-80"] = "aphania";
tags["04-71-C2-7A-E0-60-80"] = "junganyika";
tags["04-6A-C3-7A-E0-60-80"] = "ewaipanoma";
tags["04-0F-C7-7A-E0-60-81"] = "monomotapa";
tags["04-1A-BF-7A-E0-60-80"] = "bampopo";
tags["04-80-C5-7A-E0-60-80"] = "misnie";
tags["04-88-C5-7A-E0-60-80"] = "centrum_terrae";
tags["04-F7-C8-7A-E0-60-80"] = "kravonia";
tags["04-3C-C2-7A-E0-60-80"] = "milosis";
tags["04-98-C5-7A-E0-60-80"] = "portiuncula";


/////////////////////////////////////////////////

var serial_ports = [
	"/dev/ttyUSB0",
	"/dev/ttyUSB1",
	"/dev/ttyUSB2",
	"/dev/ttyUSB3",
	"/dev/ttyUSB4"
	]

var mqtt_prepend = "wavespace";

var mqtt_server = "wavespace.local";
var mqtt_user = ""
var mqtt_pass = ""

/////////////////////////////////////////////////

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://'+mqtt_server,{"username":mqtt_user,"password":mqtt_pass})

client.on('connect', function () {
      client.subscribe('wavespace/hardcontroller_publish_all/#',function(err) {});
      
  client.subscribe('wavespace/set_controller/#', function (err) {
    if (!err) {
      client.publish('wavespace/serial2mqtt', 'started')
    }
  }) 
})

client.on('message', function (topic, message) {

	parseMqtt(topic, message.toString());
//  	client.end()
})

/////////////////////////////////////////////////

var colors = require('colors');

console.log('///////////////////////////////////////////////'.blue);
console.log('SERIAL2MQTT START'.blue);
console.log('///////////////////////////////////////////////\n'.blue);

var ports = [];

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


var num_ports = serial_ports.length;

/////////////////////////////////////////////////

// didn't mange to create on the fly

var parsers = [];

parsers[0] = new Readline({delimiter: '\n'});
parsers[0].on('data', function(data){
    globalSerialParser(trim(data),0);      
});

parsers[1] = new Readline({delimiter: '\n'});
parsers[1].on('data', function(data){
    globalSerialParser(trim(data),1);      
});

parsers[2] = new Readline({delimiter: '\n'});
parsers[2].on('data', function(data){
    globalSerialParser(trim(data),2);      
});

parsers[3] = new Readline({delimiter: '\n'});
parsers[3].on('data', function(data){
    globalSerialParser(trim(data),3);      
});

parsers[4] = new Readline({delimiter: '\n'});
parsers[4].on('data', function(data){
    globalSerialParser(trim(data),4);      
});

parsers[5] = new Readline({delimiter: '\n'});
parsers[5].on('data', function(data){
    globalSerialParser(trim(data),5);      
});

/////////////////////////////////////////////////

var portMapping = {};


/////////////////////////////////////////////////

// Tag reading

var tagReaders = {};

function checkTags(){

	now = new Date().getTime();

	for(reader_id in tagReaders){
		if(now - tagReaders[reader_id].updated > 1000 && tagReaders[reader_id].tag!=""){
			tagReaders[reader_id].tag = "";
			sendMqtt("/hardcontroller/"+reader_id+"/pot/TAG_OFF", "");
		}
	}

    setTimeout(checkTags,500);

}

checkTags();

function onTag(reader_id, tag_id){

	if(!tagReaders[reader_id]){
		tagReaders[reader_id] = {updated:0,tag:""};
	}

	tagReaders[reader_id].updated = new Date().getTime();
	if(tagReaders[reader_id].tag != tag_id){
        if(tags[tag_id]){
            var out = tags[tag_id];
        } else {
            var out = tag_id;
        }
		sendMqtt("/hardcontroller/"+reader_id+"/pot/TAG_ON", out);
		tagReaders[reader_id].tag = tag_id;
	} 

}

/////////////////////////////////////////////////

function globalSerialParser(data, parser_id){


    if(data.substr(0,10)=="DEVICE_ID:"){

        var id = data.replace(/\D/g, "");

        if(id>10000 && id<=10000+num_ports){
            console.log("[SERIAL] Register new device.".green + " DEVICE_ID: " + id + " to PORT_ID " + parser_id + " " + serial_ports[parser_id]);
            portMapping[id] = parser_id;
            ports[parser_id].deviceId = id;
            ports[parser_id].port.write("publish_all\n"); // ask to idetify

        } else {
            console.log("[SERIAL] No device id at port: " + parser_id + " to " + id);
        }

    } else if(data.indexOf("tag")>0 && data.indexOf("controller")>0){

    	var tag = data.split("/");
    	if(tag.length == 6){ // "/controller/4/tag/%s"
    		if(tag[1]=="controller" && tag[2]>0 && tag[3]=="tag" && tag[4]!=""){
    			onTag(tag[2],trim(tag[4]));
    		} 
    		
    	}

	   	datas = data.split(":");
	 	
	 
	} else if(data.substr(0,15) == "/hardcontroller"){

	   	datas = data.split(":");
	 	sendMqtt(trim(datas[0]), trim(datas[1]));
	 
	} else if(data.indexOf("[D]")>0){

	} else {

        console.log("[SERIAL " +  ports[parser_id].deviceId + "]: "+data.red);
    }

}


function parseMqtt(topic, message){

	topic = topic.split("/");

	if(topic[1]=="hardcontroller_publish_all"){

		id = topic[2];
    	if(id >= 10001 && id<=10000+num_ports){
	   		ports[portMapping[id]].port.write("publish_all\n"); // ask to idetify
	    }

	} else if(topic[1]=="set_controller"){

		if(topic[2]){
			id = topic[2];

			 if(id >= 10001 && id<=10000+num_ports){

			 	if(topic[3]=="led"){

			 		if(topic[4]==0){

				 		var m = message.split(" ");
				 		if(m.length == 4){
				 			serial_payload = "led 0 " + message;
				 			console.log("[MQTT] Send to DEVICE_ID " + id + " message '" + serial_payload + "'");
				 			 ports[portMapping[id]].port.write(serial_payload + "\n");
				 		}
					}
			 	}
			 }

		} 

	}

	console.log(topic);
  // message is Buffer
  console.log(message)

}

/////////////////////////////////////////////////

function sendMqtt(topic, value){

	topic = mqtt_prepend + topic;

	console.log("[MQTT] Send to topic " + topic.green + ", value: '" + value + "'")

    client.publish(topic, value)

}



/////////////////////////////////////////////////

function sendToSerial(device_id, cmd, msg){



    msg = device_id + " " + cmd + " "+ msg;
    ports[portMapping[device_id]].port.write(msg + "\n");
    //console.log(msg);

}

/////////////////////////////////////////////////


for (var i = 0; i < serial_ports.length; i++) {
    
    ports.push({});

    try{

        ports[i].opened = false;
        ports[i].device = serial_ports[i];
        ports[i].port = new SerialPort(ports[i].device, {
          baudRate: 115200
        });

        ports[i].port.on('open', function(i){

        	for (var j = 0; j < serial_ports.length; j++) {
        		if(serial_ports[j]==this.path){
        			var port_id = j;
        		}
        	
        	}

            console.log("[SERIAL] " + this.path + " opened".green);
            ports[port_id].opened = true;
            ports[port_id].deviceId = 20001+port_id;
            ports[port_id].port.pipe(parsers[port_id]);
            ports[port_id].port.write("10000\n"); // ask to idetify

        });

    } catch(e){
      console.log("No ESP32 connected to /dev/ttyUSB" + i);
      process.exit();
    }

}

function trim(str){

  str = str.replace(/^\s+|\s+$/g,'');
  return str;

}

function checkSerialPort(){

    const exec = require('child_process').exec;
    exec("ls /dev/ttyUSB0",{maxBuffer:200*1024*1000},function(error,stdout,stderr){ 
        setTimeout(checkSerialPort,5000);
        
        if(trim(stdout)=="/dev/ttyUSB0"){
            // console.log("USB device alive".green);
        } else {
            console.log("Arduino device not connected! Please call Timo!".red);
        }

    });


}

//checkSerialPort();