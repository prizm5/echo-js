let config = require('./config');
var awsIot = require('aws-iot-device-sdk');
console.log(config.keyPath);
var device = awsIot.device({
  keyPath: config.keyPath,
 certPath: config.certPath,
   caPath: config.caPath,
 clientId: config.clientId,
     host: config.awshost
});

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('topic_1');
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
    device.publish('topic_2', JSON.stringify({ test_data: 1}));
  });