'use strict';

var request = require('request');
const FauxMo = require('fauxmojs');
const toggler = require('./toggler');
var outlets = require('./outlets.json');

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => {
			var msg = JSON.stringify({ name: name, port: port, id: id, action: action });
			rsmq.sendMessage({ qname: "myqueue", message: msg }, (err, resp) => {
				if (resp) { console.log("Message sent. ID:", resp); }
			});
		}
	}
}


// makedevice('Living Room', 11001, 2),
// makedevice('Everything', 11005, 6)

let fauxMo = new FauxMo({
	ipAddress: '192.168.0.102',
	devices: [
		makedevice('Living Room', 11001, 2),
		makedevice('Couch', 11002, 3),
		makedevice('TV', 11003, 4),
		makedevice('Chargers', 11004, 5),
	]
});

console.log('started..');

startLightListener();
