////////////////////////////////////////////////////////////////////////

// Wavespace Startup Script
// 

////////////////////////////////////////////////////////////////////////


var path = require('path');
var colors = require('colors');

////////////////////////////////////////////////////////////////////////

if(conf.launchChrome){

	const chromeLauncher = require('chrome-launcher');

	const newFlags = chromeLauncher.Launcher.defaultFlags().filter(flag => flag !== '--mute-audio');

	newFlags.push("--kiosk");

	console.log(newFlags);
	/*
	chromeLauncher.launch({
	  startingUrl: 'https://google.com'
	}).then(chrome => {
	  console.log(`Chrome debugging port running on ${chrome.port}`);
	});
	*/
	chromeLauncher.launch({
	  ignoreDefaultFlags: true,
	  chromeFlags: newFlags,
	  startingUrl: conf.wavespace_server
	}).then(chrome => {
	  console.log(`Chrome debugging port running on ${chrome.port}`);
	});

}

if(conf.launchFirefox){

	var open = require("open");
	open(conf.wavespace_server, "firefox");

}
