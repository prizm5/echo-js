'use strict';

module.exports = function xmlGetResponse(state) {
  var theaction = 'Get'
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <s:Body>
    <u:${theaction}BinaryStateResponse xmlns:u="urn:Belkin:service:basicevent:1">
      <BinaryState>${state}</BinaryState>
    </u:${theaction}BinaryStateResponse>
  </s:Body>
</s:Envelope>`;
}

