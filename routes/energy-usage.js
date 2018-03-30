const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');

router.get('/:deviceId/realtime', function(req, res, next) {
  
  let deviceId = req.params.deviceId;

  let realtimeUsage = {};
  // TODO - cache results with a short TTL so we don't hammer the plug if multiple clients are requesting data
  deviceManager.getDevice(deviceId).emeter.getRealtime().then(response => {

    // Voltage seems to be reported as its peak to peak voltage, not RMS.
    // Show the RMS value since thats what would you expect to see.
    // i.e. 220v not 310v (in the U.K)
    response.voltage = response.voltage / Math.sqrt(2);

    res.json(response);
  });

});

module.exports = router;