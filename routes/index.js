var express = require('express');
var router = express.Router();

const { Client } = require('tplink-smarthome-api');

const client = new Client();
var devices = [];

client.startDiscovery({deviceTypes: ['plug']}).on('plug-new', plug => {
  console.log('Found device: ' + plug.alias + ' [' + plug.deviceId + ']');
  devices.push(plug);
})

router.get('/', function(req, res, next) {

  let realtimeUsage = {};
  devices[0].emeter.getRealtime().then(response => {

    realtimeUsage.power = Math.round(response.power);
    realtimeUsage.current = response.current.toFixed(2);
    realtimeUsage.voltage = Math.round(response.voltage);

    res.render('index',{
      device: devices[0],
      devices: devices,
      realtimeUsage: realtimeUsage
      });
  });

});


module.exports = router;
