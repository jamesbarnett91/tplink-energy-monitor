const { Client } = require('tplink-smarthome-api');

const client = new Client();
var devices = [];

client.startDiscovery({
    deviceTypes: ['plug'],
    discoveryTimeout: 20000
  }).on('plug-new', plug => {
  console.log('Found device: ' + plug.alias + ' [' + plug.deviceId + ']');
  devices.push(plug);
});

module.exports.getDevice = function(deviceId) {

  return devices.find(d => d.deviceId == deviceId);

}

module.exports.getAllDevices = function() {
  return devices;
}