// Config


exports.getConf = function () {

var conf = require(__dirname+'/global.js');
conf = conf.getConf();


/////////////////////////////////////

return conf;

};