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

* Install Ubuntu Studio with:

	* pure data 
	* jack


* Install Chromium
```
sudo apt install chromium-browser
```

* Install Node JS and NPM
```
sudo apt install nodejs npm
```

* Clone this repository
```
sudo apt get install git
sudo mkdir /opt/wavespace
cd /opt && git clone https://github.com/timotoots/wavespace.git
```

* Install node modules
```
cd /opt/wavespace
npm i
```

* Change configuration
Add a new configuration file as you hostname.js 

** Change speaker positions in the room  
** Change LED bulb position in the room

* Run 
```
node server/server.js
```

# Use cheap Wifi LED RGB Bulbs

* Buy Teckin SB50 from Amazon

* Use Tuya convert to flash Tasmota open source firmware to the bulb. Follow instructions here:

https://github.com/ct-Open-Source/tuya-convert


