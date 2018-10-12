var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
var lights = {};
client.on('light-new', function(light) {
	  console.log('****************',light.id);
	  lights[light.id] = light;
}); 
client.init({
	  lightOfflineTolerance: 3, // A light is offline if not seen for the given amount of discoveries
	  messageHandlerTimeout: 45000, // in ms, if not answer in time an error is provided to get methods
	  startDiscovery: true, // start discovery after initialization
	  resendPacketDelay: 150, // delay between packages if light did not receive a packet (for setting methods with callback)
	  resendMaxTimes: 3, // resend packages x times if light did not receive a packet (for setting methods with callback)
	  debug: false, // logs all messages in console if turned on
	  address: '0.0.0.0', // the IPv4 address to bind the udp connection to
	  broadcast: '255.255.255.255', // set's the IPv4 broadcast address which is addressed to discover bulbs
	  lights: ['192.168.0.103'] // Can be used provide a list of known light IPv4 ip addresses if broadcast packets in network are not allowed
});

let turnOffLight = function(light) {
	  console.log('turning off light', light);
	  lights[light].off(500,()=>{
		      console.log("light is off", light);
		    });
}

let turnOnLight = function(light) {
	  console.log('turning on light', light);
	  lights[light].on(1000, () => { console.log("light is on", light); }); 
	  lights[light].color(50, 50, 100, 3500, 500)
}

module.exports = {
	  turnOnLight: turnOnLight,
	  turnOffLight: turnOffLight
};
