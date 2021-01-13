  
int currentState[5] = {-1,-1,-1,-1,-1};
#include "esp_task_wdt.h"

#define CONTROLLER_ID 4

const int DEBUG_ENABLED = 1;
#include "CommandLine.h"

TaskHandle_t Task1;
TaskHandle_t Task2;


int matrix_display = -1;

  void  setup() {
    
    Serial.begin(115200);
    Serial.println("START");

     Serial.print("DEVICE_ID: 1000");
     Serial.println(CONTROLLER_ID);
     
    setup_touch();
    setup_rgb();
    setup_pot();
     setup_led_analog();

  xTaskCreatePinnedToCore(
      Task1code,   /* Task function. */
      "Task1",     /* name of task. */
      10000,       /* Stack size of task */
      NULL,        /* parameter of the task */
      1,           /* priority of the task */
      &Task1,      /* Task handle to keep track of created task */
      0);          /* pin task to core 0 */                  
  delay(500); 

  
 // xTaskCreatePinnedToCore(
 //     Task2code,   /* Task function. */
//      "Task2",     /* name of task. */
 //     10000,       /* Stack size of task */
 //     NULL,        /* parameter of the task */
 //     1,           /* priority of the task */
 //     &Task2,      /* Task handle to keep track of created task */
 //     1);          /* pin task to core 1 */
 //   delay(500); 

}



bool parse_command(char * commandLine) {

  char * ptrToCommandName = strtok(commandLine, delimiters);

  if (strcmp(ptrToCommandName, "10000") == 0) {

       Serial.print("DEVICE_ID: ");
       Serial.println(10000 + CONTROLLER_ID);
            
  } else if (strcmp(ptrToCommandName, "led") == 0) {
     int led_id = readNumber();
     int led_red = readNumber();
     int led_green = readNumber();
     int led_blue = readNumber();
     int led_blink = readNumber();
  
    Serial.print("Led set ID=");
    Serial.print(led_id);
    Serial.print(" ");     
    Serial.print(led_red);
    Serial.print(":");    
    Serial.print(led_green);
    Serial.print(":");  
    Serial.print(led_blue);
    Serial.print(":");  
    Serial.println(led_blink);
    
    change_led(led_id, led_red, led_green, led_blue, led_blink);

            
  } else  if (strcmp(ptrToCommandName, "mosfet") == 0) {
     int led_id = readNumber();
     int led_power = readNumber();
  
    Serial.print("Led mosfet ID=");
    Serial.print(led_id);
    Serial.print(": power ");     
    Serial.print(led_power);

    change_mosfet(led_id, led_power);

            
  } else {
    if (strcmp(ptrToCommandName, "matrix") == 0) {
      matrix_display = readNumber();
      Serial.print("Matrix set to ");
      Serial.println(matrix_display);
       
    } else {
     // nullCommand(ptrToCommandName);
    }
  }
}

void Task1code( void * pvParameters ){

  Serial.print("Task1 running on core ");
  Serial.println(xPortGetCoreID());

  for(;;){
  
    loop_pot(NULL);
    loop_rgb(NULL);
   // loop_led_analog(NULL);
    bool received = getCommandLineFromSerialPort(CommandLine);      //global CommandLine is defined in CommandLine.h
    if (received) parse_command(CommandLine);
    yield();   
  }

}



void Task2code( void * pvParameters ){

  Serial.print("Task2 running on core ");
  Serial.println(xPortGetCoreID());
  setup_nfc();
  for(;;){
      loop_nfc(NULL);
      yield();
  }

}


void loop() {
 
 vTaskDelete(NULL);
 
}
