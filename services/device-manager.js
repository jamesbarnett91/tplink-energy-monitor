const { Client } = require('tplink-smarthome-api');
const dataLogger = require('./data-logger');

const client = new Client();
var devices = [];

client.startDiscovery({
    deviceTypes: ['plug'],
    discoveryTimeout: 20000
  }).on('plug-new', registerPlug);

function registerPlug(plug) {
  
  if (plug.supportsEmeter) {
    console.log('Found device with energy monitor support: ' + plug.alias + ' [' + plug.deviceId + ']');
    devices.push(plug);
    dataLogger.startLogging(plug);
  } else {
    console.log('Skipping device: ' + plug.alias + ' [' + plug.deviceId + ']. Energy monitoring not supported.');
  }
  
}

module.exports.getDevice = function(deviceId) {

  return devices.find(d => d.deviceId == deviceId);

}

module.exports.getAllDevices = function() {
  return devices;
}