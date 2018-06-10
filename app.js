'use strict';

var request = require('request');
const FauxMo = require('fauxmojs');
const toggler = require('./toggler');

RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });

rsmq.createQueue({ qname: "myqueue" }, function (err, resp) {
	if (resp === 1) {
		console.log("queue created")
	}
});

let makedevice = (name, port, id) => {
	return {
		name: name,
		port: port,
		handler: (action) => {
			rsmq.sendMessage({qname:"myqueue", message:{id: id,action: action}}, function (err, resp) {
				if (resp) {
					console.log("Message sent. ID:", resp);
				}
			});
		},
		getStateHandler: (device) => {
			return 1; // Always on.
		}
	}
}

let fauxMo = new FauxMo(
	{
		ipAddress: '192.168.0.102',
		devices: [
			makedevice('Bedroom', 11000, 1),
			makedevice('Living Room', 11001, 2),
			makedevice('Balcony', 11002, 3),
			makedevice('TV', 11003, 4),
			makedevice('Chargers', 11004, 5),
			makedevice('Everything', 11005, 6)
		]
	});

console.log('started..');
