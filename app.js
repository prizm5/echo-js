'use strict';

var request = require('request');
const FauxMo = require('fauxmojs');
const toggler = require('./toggler');
var outlets = require('./outlets.json');
var mqhost = process.env.MQHOST || "192.168.0.102";
var RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: mqhost, port: 6379, ns: "rsmq" });

var sendMessage = (name,id,port,action) => {
	var msg = JSON.stringify({ name: name, port: port, id: id, action: action });
	return rsmq.sendMessage({ qname: "myqueue", message: msg }, (err, resp) => {
		if (resp) { 
			console.log("Message sent. ID:", resp); 
			return true;
		}
		else { return false; }
	});
}

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => { 
			if(id === 6 ) {
				for (let index = 1; index < 6; index++) {
					sendMessage(name, index, port, action);
				}
			}
			else {
				sendMessage(name, id, port, action);
			}
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

// startLightListener();