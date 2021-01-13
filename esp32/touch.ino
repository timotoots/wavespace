/*
  Flopper ESP32 / Toiúuch
  
  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
*/


///////////////////////////////////////////////////////////////////


unsigned long last_touch_time = 0;

int threshold = 30;

void touch_act(){

  unsigned long interrupt_time = millis();

  if (interrupt_time - last_touch_time > 300){
  
      Serial.print("/controller");
      Serial.print(CONTROLLER_ID);
      Serial.print("/touch/PAUSE");
      Serial.print(":");
      Serial.println("ON");
      last_touch_time = interrupt_time;
    
   }
     
  
}




void setup_touch() {
   
  touchAttachInterrupt(12, touch_act, threshold);


}
