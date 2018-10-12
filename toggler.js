var controller = require('./lifx-controller');
var outlets = require('./outlets.json');
var exec = require('child_process').exec;
var codeSendPulseLength = "189";
var codeSendPIN = "0";

RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({
  host: "127.0.0.1",
  port: 6379,
  ns: "rsmq"
});
rsmq.createQueue({
  qname: "myqueue"
}, (err, resp) => {
  if (resp === 1) {
    console.log("queue created")
  }
});

startLightListener = () => {
  rsmq.popMessage({
    qname: "myqueue"
  }, function (err, resp) {
    if (resp.id) {
      var msg = JSON.parse(resp.message);
      console.log("Message received.", msg);
      if (msg.id == 6) {
        for (let index = 0; index < 6; index++) {
          var msg = JSON.stringify({
            name: name,
            port: port,
            id: index,
            action: action
          });
          rsmq.sendMessage({
            qname: "myqueue",
            message: msg
          }, (err, resp) => {
            if (resp) {
              console.log("Message sent. ID:", resp);
            }
          });
        }
        setTimeout(startLightListener, 200);
      } else {
        Toggle(msg.id, msg.action);
        setTimeout(startLightListener, 600);
      }
    } else {
      setTimeout(startLightListener, 200);
    }
  });
};

var sendCode = (code) => {
  var cmd = './codesend ' + code + ' -p ' + codeSendPIN + ' -l ' + codeSendPulseLength;
  console.log("Executing command: ", cmd);
  return exec(cmd, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log('Error calling cmd: ', cmd, error, stderr);
      return false;
    } else {
      console.log("cmd success: ", stdout);
      return true;
    }
  });
}

Toggle = (id, state) => {
  console.log('toggling light', id, state);
  outlet = outlets.filter(function (o) {
    return o.id == id;
  })[0];
  if (outlet.lifx) {
    if (state == 'on') {
      controller.turnOnLight(outlet.lifx);
    } else {
      controller.turnOffLight(outlet.lifx);
    }
  } else {
    sendCode(outlet[state]);
  }
}