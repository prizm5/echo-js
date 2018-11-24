'use strict';

const FauxMo = require('fauxmojs');
let toggler = require('./toggler');
let rsmq = require('./qmgr');

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => {
			var msg = JSON.stringify({ name: name, id: id, action: action });
			rsmq.sendMessage({ qname: "myqueue", message: msg }, (err, resp) => {
				if (resp) { console.log("Message sent. ID:", resp); }
			});
		}
	}
}

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

require('./aws-client');

toggler.startLightListener();
