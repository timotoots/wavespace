

#define SENSORS 12
#define READINGS 12

String POT_LABELS[SENSORS] = { "POS_Z","POS_Y","POS_X","SHAPE_BLUR","SHAPE_HEIGHT","SHAPE_LENGTH","SHAPE_WIDTH","ORBIT_SPEED","ORBIT_ROTATE","ORBIT_LENGTH","ORBIT_WIDTH","VOLUME"};
int POT_PINS[SENSORS] = {36,39,34,35,32,33,25,26,27,14,13,15};

/*

PINOUT

36/VP - POS_Z
39/VN - POS_Y
34 - POS_X
35 - SHAPE_BLUR
32 - SHAPE_HEIGHT
33 - SHAPE_LENGTH
25 - SHAPE_WIDTH
26 - ORBIT_SPEED
27 - ORBIT_ROTATE
14 - ORBIT_LENGTH
12 - TOUCH
GND
13 - ORBIT_WIDTH


GND
23/SPI_MOSI
22/I2C_SCL
TX
RX
21/I2C_SDA - MOSFET 1
GND
19/SPI_MISO
18/SPI_SCK
5/SPI_SS
17 - LED
16
4
0
2 - BACKLIGHT MOSFET 0
15 - VOLUME


 */
 


int readings[SENSORS][READINGS];
int last_published_reading[SENSORS];

///////////////////////////

void setup_pot(void){
 
 for (int s = 0; s < SENSORS; s++){
  for (int i = 0; i < READINGS; i++){
   pinMode(POT_PINS[s], INPUT); 
    readings[s][i] = map(analogRead(POT_PINS[s]), 4095, 0, 0, 125);
  }
  last_published_reading[s] = 0;
 }


}

///////////////////////////

void loop_pot(void * parameter){

 int publish_pots_now = 0;
 
 if(publish_all_pots==1){
  publish_all_pots = 0;
  publish_pots_now = 1;
 }

 for (int s = 0; s < SENSORS; s++){
  sensor_read(s);
  int average = average_reading(s);
  int diff = abs(average - last_published_reading[s]);
   
  if(diff > 2 || publish_pots_now==1){

    Serial.print("/hardcontroller/");
    Serial.print(CONTROLLER_ID);
    Serial.print("/pot/");
    Serial.print(POT_LABELS[s]);
    Serial.print(":");
    Serial.println(average);
    
    last_published_reading[s] = average;
  }
 } // for

 
 delay(10);
}

///////////////////////////

void sensor_read(int sensor) {
  
 // Shift out the last reading
 for (int i = 1; i < READINGS; i++){
   readings[sensor][i] = readings[sensor][i-1];
 }
 
 // Insert the new reading
 readings[sensor][0] = map(analogRead(POT_PINS[sensor]), 4095, 0, 0, 255);

}

///////////////////////////

// Find average of all readings
float average_reading(int sensor){
  
 long sum = 0;
 for (int i = 0; i < READINGS; i++){
   sum += readings[sensor][i];
 }
 return sum/READINGS;
 
}
