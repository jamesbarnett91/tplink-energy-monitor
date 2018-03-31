const express = require('express');
const router = express.Router();

const deviceManager = require('../services/device-manager');
const moment = require('moment');

router.get('/:deviceId/realtime', function(req, res, next) {

  let deviceId = req.params.deviceId;

  let realtimeUsage = {};
  // TODO - cache results with a short TTL so we don't hammer the plug if multiple clients are requesting data
  deviceManager.getDevice(deviceId).emeter.getRealtime().then(response => {

    // Voltage seems to be reported as its peak to peak value, not RMS.
    // Show the RMS value since thats what would you expect to see.
    // i.e. 220v not 310v (in the U.K)
    response.voltage = response.voltage / Math.sqrt(2);

    res.json(response);
  });

});

router.get('/:deviceId/day-stats', function(req, res, next) {
  
  let deviceId = req.params.deviceId;

  // Get last x days
  let totalDaysRequired = 30; // TODO currently only works for up to 2 months spans
  let currentMoment = moment();
  let previousMoment = moment().subtract(totalDaysRequired, 'days');

  // Month + 1 as the API months are index 1 based.
  deviceManager.getDevice(deviceId).emeter.getDayStats(currentMoment.year(), currentMoment.month() +1).then(currentPeriodStats => {

    // Check if we also need the previous month to meet the required total number of samples
    if(currentMoment.month() !== previousMoment.month()) {
      
      // Get previous month. This currently wont work if the previousMoment is more than 1 month before the currentMoment (see above)
      deviceManager.getDevice(deviceId).emeter.getDayStats(previousMoment.year(), previousMoment.month() +1).then(previousPeriodStats => {

        let currentMonthStats = fillMissingDays(currentPeriodStats, currentMoment);
        let previousMonthStats = fillMissingDays(previousPeriodStats, previousMoment);
        let combinedStats = previousMonthStats.concat(currentMonthStats);

        res.json(trimDayStatResults(combinedStats, totalDaysRequired));

      });
    }
    else {
      let dayStats = fillMissingDays(currentPeriodStats, currentMoment);
  
      res.json(trimDayStatResults(dayStats, totalDaysRequired));
    }

  });

});

function fillMissingDays(sparseDayStats, statsMoment) {
  let denseDayStats = [];

  // Fill in any missing days
  let totalDays = statsMoment.date();
  Array.from({length: totalDays}, (x,i) => i + 1).forEach(d => {

    let stat = sparseDayStats.day_list.find(i => i.day === d);

    if(stat === undefined) {
      denseDayStats.push({
        year: statsMoment.year(),
        month: statsMoment.month() +1,
        day: d,
        energy: 0
      })
    }
    else {
      denseDayStats.push(stat);
    }

  });

  return denseDayStats;
}

function trimDayStatResults(stats, maxSamples) {
  return stats.splice(stats.length - maxSamples, stats.length);
}

module.exports = router;