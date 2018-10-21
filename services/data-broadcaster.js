const app = require('../app');

function broadcastRealtimeUsageUpdate(deviceId, data) {
  broadcast(generatePayload('realtimeUsage', deviceId, data));
}

function broadcastDailyUsageUpdate(deviceId, data) {
  broadcast(generatePayload('dailyUsage', deviceId, data));
}

function broadcastMonthlyUsageUpdate(deviceId, data) {
  broadcast(generatePayload('monthlyUsage', deviceId, data));
}

function broadcastPowerStateUpdate(deviceId, data) {
  broadcast(generatePayload('powerState', deviceId, data));
}

function broadcastNewLogEntry(deviceId, data) {
  broadcast(generatePayload('newLogEntry', deviceId, data));
}

function broadcast(payload) {
  app.getWsClients().forEach(client => {
    client.send(payload);
  })
}

function generatePayload(dataType, deviceId, data) {

  let payload = {
    dataType: dataType,
    deviceId: deviceId,
    data: data
  }

  return JSON.stringify(payload);
}


module.exports = {
  broadcastRealtimeUsageUpdate: broadcastRealtimeUsageUpdate,
  broadcastDailyUsageUpdate: broadcastDailyUsageUpdate,
  broadcastMonthlyUsageUpdate: broadcastMonthlyUsageUpdate,
  broadcastPowerStateUpdate: broadcastPowerStateUpdate,
  broadcastNewLogEntry: broadcastNewLogEntry,
  generatePayload: generatePayload
}
