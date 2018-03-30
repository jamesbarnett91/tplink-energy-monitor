const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');

router.get('/', function(req, res, next) {

  res.render('index', {
    device: deviceManager.getDevice(),
    devices: deviceManager.getAllDevices()
  });

});


module.exports = router;
