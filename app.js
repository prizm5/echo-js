'use strict';

var request = require('request');
const FauxMo = require('fauxmojs');
const toggler = require('./toggler');
var outlets = require('./outlets.json');

RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "192.168.0.102", port: 6379, ns: "rsmq" });
rsmq.createQueue({ qname: "myqueue" }, (err, resp) => {
	if (resp === 1) { console.log("queue created") }
});

outlets.forEach(element => {
	element.state = "Off";
});

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => {
			var msg = JSON.stringify({name: name, port: port, id: id, action: action});
			rsmq.sendMessage({ qname: "myqueue", message: msg }, (err, resp) => {
				if (resp) { console.log("Message sent. ID:", resp); }
			});
		},
		getStateHandler: (device) => {
			console.log('status checked ', device);
			return 1; // Always on.
		}
	}
}

let fauxMo = new FauxMo({
	ipAddress: '192.168.0.102',
	devices: [
		makedevice('Bedroom', 11000, 1),
		makedevice('Living Room', 11001, 2),
		makedevice('Couch', 11002, 3),
		makedevice('TV', 11003, 4),
		makedevice('Chargers', 11004, 5),
		makedevice('Everything', 11005, 6)
	]
});

console.log('started..');

startLightListener();