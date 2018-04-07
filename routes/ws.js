const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');
const dataFetcher = require('../services/data-fetcher');
const dataBroadcaster = require('../services/data-broadcaster');

router.ws('/', function(ws, req) {

  ws.on('message', msg => {

    // Latest data is always pushed out to clients, but clients can also request cached data at any time.
    if(msg === 'getCachedData') {
      let cachedData = dataFetcher.getCachedData();

      ws.send(dataBroadcaster.generatePayload('realtimeUsage', cachedData.realtimeUsage));
      ws.send(dataBroadcaster.generatePayload('dailyUsage', cachedData.dailyUsage));
      ws.send(dataBroadcaster.generatePayload('monthlyUsage', cachedData.monthlyUsage));
      ws.send(dataBroadcaster.generatePayload('powerState', cachedData.powerState));
    }
  });

});

module.exports = router;
