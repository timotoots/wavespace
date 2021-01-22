const { exec } = require('child_process');
var yourscript = exec('jack_lsp -c',
        (error, stdout, stderr) => {

       	    const lines = stdout.split(/\r?\n/);
       	    var last_line = "";

       	     lines.forEach((line) => {
       	     	if(line.substr(0,2)=="  "){
       	     		line = line.replace("   ","");
       	     		var cmd = 'jack_disconnect "'+ line +'" "' + last_line +'"';
       	     		console.log(cmd);
       	     		exec(cmd);
       	     	} else {
       	     		last_line = line.replace("   ","");
       	     	}

		        
		    });

            // console.log(stdout);
            // console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });