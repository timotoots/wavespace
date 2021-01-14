#include <FastLED.h>

#define NUM_LEDS 1
#define WSLED_PIN 17
unsigned long ledPreviousMillis = 0;


CRGB leds[NUM_LEDS];
CRGB leds_save[NUM_LEDS];


int ledBlinkMode[NUM_LEDS] = {0}; // 0 - fast, 1 - slow
unsigned long ledBlinkPreviousMillis[NUM_LEDS] = {0};

void setup_rgb() { 
   FastLED.addLeds<WS2812, WSLED_PIN, RGB>(leds, NUM_LEDS).setCorrection(Typical8mmPixel);
   FastLED.setMaxRefreshRate(25);
   for(int i=0;i<NUM_LEDS;i++){
      leds[i] = CRGB::Black;
      FastLED.show();
   }
   change_led(0,20,0,0,2);
}

void change_led(int id, int red, int green, int blue, int led_blink){

  if(id <= NUM_LEDS){
     ledBlinkMode[id] = led_blink;
     leds[id] =  CRGB(red,green,blue);
     leds_save[id] = CRGB(red,green,blue);
     FastLED.show();
     Serial.println("led done");
  }
    
}

void loop_rgb(void * parameter) { 

  for(int i = 0; i < NUM_LEDS; i++){

    // fast
    
    if(ledBlinkMode[i]==1){
  
        unsigned long currentMillis = millis();
        
        if(currentMillis - ledBlinkPreviousMillis[i] >= 3000){
          leds[i] = leds_save[i];
          FastLED.show();
          ledBlinkPreviousMillis[i] = currentMillis;
  
        } else if(currentMillis - ledBlinkPreviousMillis[i] >= 1000){
          leds[i] = CRGB::Black;
          FastLED.show();
        }
      
    } else if(ledBlinkMode[i]==2){
  
        unsigned long currentMillis = millis();
        
        if(currentMillis - ledBlinkPreviousMillis[i] >= 1000){
          leds[i] = leds_save[i];
          FastLED.show();
          ledBlinkPreviousMillis[i] = currentMillis;
  
        } else if(currentMillis - ledBlinkPreviousMillis[i] >= 500){
          leds[i] = CRGB::Black;
          FastLED.show();
        }
      
    
    }


  }
  
   
   
}




void test_rgb(void * parameter) { 
  
  FastLED.setBrightness(  10 );

  for(int i=0;i<NUM_LEDS;i++){


    leds[i] = CRGB::Red;
    FastLED.show();
    delay(500);
    leds[i] = CRGB::Green;
    FastLED.show();
    delay(500);  // Now turn the LED off, then pause
    leds[i] = CRGB::Blue;
    FastLED.show();
    delay(500);

    
  }

    for(int i=0;i<NUM_LEDS;i++){
      
      leds[i] = CRGB::Black;
      FastLED.show();

    }
       delay(1000);
  
}
