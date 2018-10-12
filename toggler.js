var controller = require('./lifx-controller');
var outlets = require('./outlets.json');
var exec = require('child_process').exec;
var codeSendPulseLength = "189";
var codeSendPIN = "0";

RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });
rsmq.createQueue({ qname: "myqueue" }, (err, resp) => {
  if (resp === 1) { console.log("queue created") }
});

startLightListener = () => {
  rsmq.popMessage({ qname: "myqueue" }, function (err, resp) {
    if (resp.id) {
      var msg = JSON.parse(resp.message);
      console.log("Message received.", msg);
      Toggle(msg.id, msg.action);
      setTimeout(startLightListener, 600);
    }
    else {
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
    }
    else {
      console.log("cmd success: ", stdout);
      return true;
    }
  });
}

Toggle = (id, state) => {
  console.log('toggling light',id,state);
  var o = outlets;
  if (id !== 6) {
   o = outlets.filter(function (o) { return o.id == id; });
   console.log('outlets',o);
  }

    o
    .filter(function (a) { return a.lifx })
    .reduce((accumulator, currentValue) => {
      if(state == 'on') {
        controller.turnOnLight(currentValue.lifx);
      } else {
        controller.turnOffLight(currentValue.lifx);
        accumulator = true;
      }},
      false
    );
  return o
    .filter(function (o) { return !o.lifx })
    .reduce((accumulator, currentValue) => {
        console.log(currentValue);
        var res = sendCode(currentValue[state]);
        accumulator = res;
      },
      false
    );
}
