/*
  Flopper ESP32 / Analog LED
  
  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
*/


///////////////////////////////////////////////////////////////////

const int ledPin = 2;

// setting PWM properties
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8;


void setup_led_analog(){
  // configure LED PWM functionalitites
  ledcSetup(0, freq, resolution);
  ledcSetup(1, freq, resolution);
  
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(2, 0); // mosfet 0
  ledcAttachPin(21, 1); // mosfet 1

}

void change_mosfet(int i, int power){
   ledcWrite(i, power);
}

void loop_led_analog(void * parameter){
  // increase the LED brightness
  for(int dutyCycle = 0; dutyCycle <= 255; dutyCycle++){   
    // changing the LED brightness with PWM
    ledcWrite(ledChannel, dutyCycle);
    delay(15);
  }

  // decrease the LED brightness
  for(int dutyCycle = 255; dutyCycle >= 0; dutyCycle--){
    // changing the LED brightness with PWM
    ledcWrite(ledChannel, dutyCycle);   
    delay(15);
  }
}
