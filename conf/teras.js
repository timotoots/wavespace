// Config


exports.getConf = function () {

var conf = require(__dirname+'/global.js');
conf = conf.getConf();

conf.pdBin = '/bin/pd';
conf.launchChrome = false;
conf.pdNoGui = false;


/////////////////////////////////////

return conf;

};