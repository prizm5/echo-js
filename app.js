'use strict';

var request = require('request');
const FauxMo = require('fauxmojs');
const toggler = require('./toggler');

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => { 
			toggler.ToggleOn(id, action)
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
		makedevice('Chargers',11004,5),
		makedevice('Everything',11005,6)
	 ]
});

console.log('started..');
