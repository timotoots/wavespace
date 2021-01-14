

////////////////////////////////////////////////

// MQTT

var client  = mqtt.connect("ws://"+conf.mqtt_ip+":1884",conf.mqtt_settings)

client.on('connect', function () {

  client.publish(conf.mqtt_prepend + '/' + SCRIPT_NAME, SCRIPT_NAME + "started");
  for (var i = 0; i < subscribe_topics.length; i++) {
    client.subscribe(conf.mqtt_prepend + subscribe_topics[i], function (err) {}) 
  }

});

client.on('message', function (topic, message) {
  parseMqtt(topic, message.toString());
});

function sendMqtt(topic, value){

  topic = conf.mqtt_prepend + topic;
  console.log("[MQTT] Send to topic " + topic + ", value: '" + value + "'")
  client.publish(topic, value)

}

////////////////////////////////////////////////


// Helpful functions

var players = [];

function mapValues(value,in_min, in_max, out_min, out_max, rounded = false, decimal=3) {
    var val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    if(rounded==true){
        return Math.round(val);
    } else {
        val = toFixedNumber(val,decimal);
        return val;

    }
  
}






function toFixedNumber(number, digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(number*pow) / pow;
}


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function mod(number,n){
  return ((number%n)+n)%n;
}

function load_config(){

  fetch("../conf/json")
  .then(response => {
     return response.json();
  })
  .then(data => console.log(data));

}