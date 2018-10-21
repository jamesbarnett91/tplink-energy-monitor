const fs = require('fs');
const dataBroadcaster = require('./data-broadcaster');

let logIntervalMs;
let maxLogEntries;

loadLogConfig();

function loadLogConfig() {
  try {
    let config  = JSON.parse(fs.readFileSync('logger-config.json', 'utf8'));
    logIntervalMs = (config.logIntervalSeconds * 1000);
    maxLogEntries = config.maxLogEntries;

  }
  catch (err) {
    console.warn('Error reading logger config. Reverting to defaults.', err);
    logIntervalMs = 60000 // 1 min
    maxLogEntries = 1440  // 24 hrs at 1/min
 }  
}

function startLogging(device) {
  setInterval(() => { log(device); }, logIntervalMs);
  console.log('Logging started for ' + device.alias + ' [' + device.deviceId + '] every ' + (logIntervalMs/1000) + ' seconds');
}

function writeLog(filePath, log) {
  fs.writeFile(filePath, JSON.stringify(log), { flag: 'w' }, (err) => {
    if (err) {
      console.warn('Error writing log for ' + device.alias + ' [' + device.deviceId + ']', err);
    }
  });
}

function getLogEntries(filePath, callback) {
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if(err) {
      // No log file, init empty one
      writeLog(filePath, []);
      callback([]);
    }
    else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.warn('Error reading usage log ' + filePath, err);
          callback([]);
        }
        else {
          callback(JSON.parse(data));
        }
      });
    }
  });
}

function log(device) {

  device.emeter.getRealtime().then(response => {

    let logEntry = {
      ts: Date.now(),
      pw: (('power_mw' in response) ? (response.power_mw / 1000) : response.power)
    }

    let filePath = getLogPath(device.deviceId);

    getLogEntries(filePath, (entries) => {
      entries.push(logEntry)
      
      // Remove old entries
      entries.splice(0, entries.length - maxLogEntries);

      writeLog(filePath, entries);
      dataBroadcaster.broadcastNewLogEntry(device.deviceId, logEntry);
    })

  });
}

function getLogPath(deviceId) {
  return deviceId + '-log.json';
}

function getLogEntriesForDevice(deviceId, callback) {
  return getLogEntries(getLogPath(deviceId), callback);
}

module.exports = {
  startLogging: startLogging,
  log: log,
  getLogEntriesForDevice: getLogEntriesForDevice
}