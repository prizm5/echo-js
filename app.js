'use strict';

var request = require('request');

const FauxMo = require('fauxmojs');

let toggle = (id, action) => {
	var url = "http://192.168.0.106/rfout/toggle.php?outletStatus=" + action + "&outletId=" + id
	console.log('Requesting ', id, action, url);
	request(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
		setTimeout(function(){console.log(body);},1000);
	     }
	     else { console.log("error", error) }
	});
}

let makedevice = (name, port, id) => {
	return {
                name: name,
                port: port,
                handler: (action) => { 
			toggle(id,action);
			setTimeout(function(){console.log(name, port, id);},1000);
		 }
	}
}

let fauxMo = new FauxMo(
    {
        ipAddress: '192.168.0.106',
        devices: [ 
		makedevice('Bedroom',11000,1),
		makedevice('Living Room',11001,2),
		makedevice('Balcony',11002,3),
		makedevice('TV',11003,4),
		makedevice('Chargers',11004,5)
	 ]
});

console.log('started..');
