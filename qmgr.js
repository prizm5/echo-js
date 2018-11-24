
let config = require('./config');
RedisSMQ = require("rsmq");

exports.rsmq = new RedisSMQ({
  host: config.qmgrhost,
  port: 6379,
  ns: "rsmq"
});
