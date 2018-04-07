const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');

router.get('/', function(req, res, next) {

  let deviceId = sortDevices(deviceManager.getAllDevices())[0].deviceId;

  res.redirect('/' + deviceId);

});

router.get('/:deviceId', function(req, res, next) {

  let deviceId = req.params.deviceId;

  res.render('index', {
    device: deviceManager.getDevice(deviceId),
    devices: sortDevices(deviceManager.getAllDevices())
  });

});

function sortDevices(devices) {
  return devices.slice().sort((a, b) => {
    return a.alias.toLowerCase().localeCompare(b.alias.toLowerCase())
  })
}

module.exports = router;
