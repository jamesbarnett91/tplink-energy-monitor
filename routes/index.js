const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');

router.get('/', function(req, res, next) {

  let devices = sortDevices(deviceManager.getAllDevices());

  if (devices && devices.length > 0) {
    let deviceId = devices[0].deviceId;

    res.redirect('/' + deviceId);
  } else {
    res.render('index', {});
  }

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
