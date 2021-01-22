#!/bin/bash
export DISPLAY=:0

killall chromium-browser
killall firefox
killall node

sleep 2
/usr/bin/jackd -dalsa -dhw:LP16,0 -r44100 -p1024 -n2 &
sleep 5
pactl load-module module-jack-sink channels=8
sleep 2
pactl load-module module-jack-sink channels=8
sleep 2
pacmd set-default-sink 2
sleep 2

node /opt/wavespace/services/mixer/jack.js
sleep 2
node /opt/wavespace/services/mixer/mixer.js &
sleep 5
#inputs to pure data
jack_connect "PulseAudio JACK Sink:front-left" pure_data:input0
jack_connect "PulseAudio JACK Sink:front-right" pure_data:input1
jack_connect "PulseAudio JACK Sink:rear-left" pure_data:input2
jack_connect "PulseAudio JACK Sink:rear-right" pure_data:input3
jack_connect "PulseAudio JACK Sink:front-center" pure_data:input4
jack_connect "PulseAudio JACK Sink:lfe" pure_data:input5
jack_connect "PulseAudio JACK Sink:side-left" pure_data:input6
jack_connect "PulseAudio JACK Sink:side-right" pure_data:input7

# outputs from pure data
jack_connect pure_data:output0 system:playback_1 
jack_connect pure_data:output1 system:playback_2 
jack_connect pure_data:output2 system:playback_3 
jack_connect pure_data:output3 system:playback_4 
jack_connect pure_data:output4 system:playback_5 
jack_connect pure_data:output5 system:playback_6 
jack_connect pure_data:output6 system:playback_7 
jack_connect pure_data:output7 system:playback_8 
jack_connect pure_data:output8 system:playback_9 
jack_connect pure_data:output9 system:playback_10 
jack_connect pure_data:output10 system:playback_11 
jack_connect pure_data:output11 system:playback_12 
jack_connect pure_data:output12 system:playback_13 
jack_connect pure_data:output13 system:playback_14 
jack_connect pure_data:output14 system:playback_15 
jack_connect pure_data:output15 system:playback_16 



unclutter &
xset -dpms
xset s off
# xinput map-to-output 11 HDMI-2
# xinput map-to-output 14 HDMI-1

# cp /opt/wavespace/services/devilspie_chrome.ds /home/timo/.devilspie/
# cp /opt/wavespace/services/devilspie_firefox.ds /home/timo/.devilspie/

#!/bin/bash
i=0
for id in `xinput --list | grep "ILITEK ILITEK-TP" | grep -v "Mouse" |perl -ne 'while (m/id=(\d+)/g){print "$1\n";}'`; do

    echo "setting device ID $id"

    if [ $i == 0 ]
    	then
    		xinput map-to-output $id HDMI-1
    	else
    		xinput map-to-output $id HDMI-2
    fi

    ((i++))
done

#while true; do
	firefox --kiosk  http://localhost/soundplayer/soundplayer.html  &
	sleep 2
	chromium-browser --noerrdialogs --incognito --kiosk --window-position=0,0 http://localhost/space/space.html &
        # sleep 2
	#devilspie &
#done





while :
do
	echo "all started"
	sleep 3
	node /opt/wavespace/services/hardcontroller/serial2mqtt.js
done

