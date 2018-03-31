const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');
const moment = require('moment');

router.get('/:deviceId', function(req, res, next) {

  let deviceId = req.params.deviceId;

  deviceManager.getDevice(deviceId).getSysInfo().then(response => {

    let powerState = {
      isOn: (response.relay_state === 1),
      uptime: response.on_time
    };

    res.json(powerState);
  });

});

module.exports = router;