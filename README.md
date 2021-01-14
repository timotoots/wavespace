# Wavespace

Simple, hackable, open-source spatial audio and light mixer.  

Not meant for public release, but feel free to use it however you want.  


# Hardware:

* Linux PC (Works also on Mac and Windows, tutorial for Ubuntu only)
* Sound card with multiple outputs
* Amplifier + speakers
* RGB LED bulbs running Tasmota firmware
* ESP32 DevkitC based interfaces to USB ports (optional)

# Software dependencies

* Pure Data  
* MQTT Broker (mosquitto)
* Node JS and NPM
* Chromium, Google Chrome or Firefox  

# Sound flow in Mac OS X:

firefox

# Get it running

* Install Ubuntu Studio (has Jack and Pd)

* Install Mosquitto
```
sudo apt install mosquitto
```

* Enable websockets on mosquitto

```
sudo nano /etc/mosquitto/mosquitto.conf
```

Add lines:
```
listener 1883
listener 1884
protocol websockets
```
```
sudo service mosquitto restart
 ```


* Clone this repository
```
sudo apt install git
sudo mkdir /opt/wavespace
sudo chown timo:timo /opt/wavespace
cd /opt && git clone https://github.com/timotoots/wavespace.git
```

* Install Node JS and NPM
```
sudo apt install nodejs npm
```

* Install node modules
```
cd /opt/wavespace
npm i
```

* Startup
```
xinput map-to-output 9 HDMI-1
xinput map-to-output 11 HDMI-2
```



* Install Apache
```
sudo apt install apache2
```

sudo nano /etc/apache2/sites-available/000-default.conf
ln -s /opt/wavespace/node_modules /opt/wavespace/html/node_modules
change directory line to 

```
DocumentRoot /opt/wavespace/html
```


* Install Chromium
```
sudo apt install chromium-browser
```






* Change configuration
Add a new configuration file as you hostname.js 

** Change speaker positions in the room  
** Change LED bulb position in the room

* Run 
```
node services/hardcontroller/serial2mqtt.js
node services/mixer/mixer.js
```

# Use cheap Wifi LED RGB Bulbs

* Buy Teckin SB50 from Amazon

* Use Tuya convert to flash Tasmota open source firmware to the bulb. Follow instructions here:

https://github.com/ct-Open-Source/tuya-convert


