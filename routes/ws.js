const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');
const dataFetcher = require('../services/data-fetcher');
const dataBroadcaster = require('../services/data-broadcaster');
const dataLogger = require('../services/data-logger.js');

router.ws('/', function(ws, req) {

  ws.on('message', msg => {

    let message = JSON.parse(msg);

    // Latest data is always pushed out to clients, but clients can also request cached data at any time.
    if(message.requestType === 'getCachedData') {
      let deviceId = message.deviceId;
      let cachedData = dataFetcher.getCachedData(deviceId);
      
      ws.send(dataBroadcaster.generatePayload('realtimeUsage', deviceId, cachedData.realtimeUsage));
      ws.send(dataBroadcaster.generatePayload('dailyUsage', deviceId, cachedData.dailyUsage));
      ws.send(dataBroadcaster.generatePayload('monthlyUsage', deviceId, cachedData.monthlyUsage));
      ws.send(dataBroadcaster.generatePayload('powerState', deviceId, cachedData.powerState));
      dataLogger.getLogEntriesForDevice(deviceId, (loggedData) => {
        ws.send(dataBroadcaster.generatePayload('loggedData', deviceId, loggedData));
      });
      
    }
  });

});

module.exports = router;
