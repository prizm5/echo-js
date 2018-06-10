var outlets = require('./outlets.json');
var promise = require('promise');
var codeSendPulseLength = "189";
var codeSendPIN = "0";

var exec = require('child_process').exec;
var sendCode = function (code) {
  var cmd = 'sudo ./codesend ' + code + ' -p ' + codeSendPIN + ' -l ' + codeSendPulseLength;
  console.log("Executing command: ", cmd);
  return exec(cmd, function callback(error, stdout, stderr) {
    if (error) {
      console.log('Error calling cmd: ', cmd, error);
      return false;
    }
    else if (stderr) {
      console.log('Error calling cmd stderr: ', cmd, stderr);
      return false;
    }
    else {
      console.log("cmd success: ", stdout);
      return true;
    }
  });
}

exports.ToggleOn = function (id, state) {
  if (id == 6) {
    var o = outlets;
  }
  else {
    var o = outlets.filter(function (o) { return o.id == id; });
  }

  return o.reduce(function(accumulator, currentValue, currentIndex, array) {
    sendCode(outlet[state])
      .then((val)=> { return val });
    console.log('Light tiggered', outlet.id);
    return accumulator =  currentValue == true;
  });
}
