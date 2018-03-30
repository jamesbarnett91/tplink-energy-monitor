const { Client } = require('tplink-smarthome-api');

const client = new Client();
var devices = [];

client.startDiscovery({deviceTypes: ['plug']}).on('plug-new', plug => {
  console.log('Found device: ' + plug.alias + ' [' + plug.deviceId + ']');
  devices.push(plug);
})

module.exports.getDevice = function(deviceId) {
  // TODO - get by id
  return devices[0];
}

module.exports.getAllDevices = function() {
  return devices;
}