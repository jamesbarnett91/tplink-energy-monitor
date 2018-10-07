const fs = require('fs');
const dataBroadcaster = require('./data-broadcaster');

function startLogging(device) {
  setInterval(() => { log(device); }, 60000);
  console.log('Logging started for ' + device.alias + ' [' + device.deviceId + ']');
}

function log(device) {

  device.emeter.getRealtime().then(response => {

    let logEntry = {
      timestamp: Date.now(),
      power: (('power_mw' in response) ? (response.power_mw / 1000) : response.power)
    }

    // TODO only log up to a max number of entries

    fs.writeFile(device.deviceId + '-log.json', JSON.stringify(logEntry) + '\n', { flag: 'a' }, (err) => {
      if(err) {
        console.warn('Error writing log entry for ' + device.alias + ' [' + device.deviceId + ']', err);
      }
      else {
        dataBroadcaster.broadcastNewLogEntry(device.deviceId, logEntry);
      }

    });

  });

}

function getAllEntries(deviceId, callback) {
  fs.readFile(deviceId + '-log.json', 'utf8', (err, data) => {
    if(err) {
      console.warn('Error reading usage log ' + deviceId + '-log.json', err);
      return;
   }
   else {
      let logLines = data.split(/\r?\n/);
      let logEntries = [];

      logLines.forEach(line => {
        if(line.length > 0) {
          logEntries.push(JSON.parse(line))
        }
      });

     callback(logEntries);
    }
  });
}

module.exports = {
  startLogging: startLogging,
  log: log,
  getAllEntries: getAllEntries
}