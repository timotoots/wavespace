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