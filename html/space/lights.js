

/*
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
*/

var lastLedChange = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];



function changeLed(id,color){

	// power = Math.round(power);

	 var d = new Date();
	  var n = d.getTime();
	  

	if(n-lastLedChange[id] < 50 && lastLedChange[id]!=0){
		return false;
	}

	lastLedChange[id] = n;

	// if(curPower==power){ 
	// 	return false;
	// }
	// curPower = power;


	if(id==0){
		id = "01";
	}

	if(id<10){
		id = "0"+id;
	}
	client.publish('cmnd/pirn'+id+'/Speed', "10");

	client.publish('cmnd/pirn'+id+'/Color1', "#"+color);

	console.log('MQTT:' + 'cmnd/pirn'+id+'/Color1' +  " #"+color);
	//client.publish('cmnd/pirn'+id+'/Dimmer', power.toString());


}



// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })

