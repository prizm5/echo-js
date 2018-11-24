'use strict';

require('dotenv').config()

exports.qmgrhost =  process.env.MQHOST || "127.0.0.1" ;
exports.keyPath="./certs/69f00dd2ab-private.pem.key";
exports.certPath="./certs/69f00dd2ab-certificate.pem.crt";
exports.caPath="./certs/AmazonRootCA1.pem";
exports.clientId="MyHomePI13213";
exports.awshost="a1v0l8ieqy5dyl-ats.iot.us-east-1.amazonaws.com"
;
