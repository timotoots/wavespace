/*
  Flopper ESP32 / Toiúuch
  
  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
*/


///////////////////////////////////////////////////////////////////


unsigned long last_touch[1] = {0};
int touch_history = -1;
int touch_history2 = -1;

unsigned long last_touch_time = 0;

int touch_pins[1] = {12};
String touch_labels[7] = { "PAUSE",};
int touch_status[1] = {0};

int threshold = 30;
int wait_for_touch = 1;

void checkMillis(int id){


      unsigned long interrupt_time = millis();
     
     if (interrupt_time - last_touch_time > 300){
        touch_status[id] = 1;
        last_touch_time = interrupt_time;
        last_touch[id] = interrupt_time;
     }

   

 
      


}


void touch_act0(){
  if(wait_for_touch==1){
  touch_status[0] = 1;
  }
}




void setup_touch() {
   
  touchAttachInterrupt(touch_pins[0], touch_act0, threshold);


}

void loop_touch(void * parameter){

      unsigned long interrupt_time = millis();

      for(int i=0;i<1;i++){
        if(touch_status[i]==1){
          wait_for_touch = 0;
          
           Serial.print("TOUCH:");
           Serial.println(touch_labels[i]);

           delay(300);
            for(int j=0;j<7;j++){
            touch_status[j]=0;
           }

          wait_for_touch = 1;
   
        }
      }
      delay(100);
      loop_touch(NULL);
}
/*
void setup(){
  Serial.begin(115200);
  setup_touch();
}

void loop(){
  
}
*/
