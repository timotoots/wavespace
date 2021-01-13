


// var mqtt = require('mqtt')
var client  = mqtt.connect(conf.mqtt)

client.on('connect', function () {

	client.publish('cmnd/pirn03/POWER', "OFF")
	// blink();

})


var state = "OFF";

function blink(){

	if(state=="OFF"){
		state = "ON"
		changeLed("03","100")
	} else {
		state = "OFF"
		changeLed("03","20")

	}


	setTimeout(blink,1000);
}


var curPower = 0;

var lastLedChange = [0,0,0];



function changeLed(id,power){

	power = Math.round(power);

	 var d = new Date();
	  var n = d.getTime();
	  

	if(n-lastLedChange[id] < 50 && lastLedChange[id]!=0){
		return false;
	}

	lastLedChange[id] = n;

	if(curPower==power){
		return false;
	}
	curPower = power;


	if(id==0){
		id = "01";
	}

	console.log(power);
	client.publish('cmnd/pirn'+id+'/Dimmer', power.toString());

}



// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })

