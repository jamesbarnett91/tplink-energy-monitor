const app = require('../app');

function broadcastRealtimeUsageUpdate(data) {
  broadcast(generatePayload('realtimeUsage', data));
}

function broadcastDailyUsageUpdate(data) {
  broadcast(generatePayload('dailyUsage', data));
}

function broadcastMonthlyUsageUpdate(data) {
  broadcast(generatePayload('monthlyUsage', data));
}

function broadcastPowerStateUpdate(data) {
  broadcast(generatePayload('powersState', data));
}

function broadcast(payload) {
  app.getWsClients().forEach(client => {
    client.send(payload);
  })
}

function generatePayload(dataType, data) {

  let payload = {
    dataType: dataType,
    data: data
  }

  return JSON.stringify(payload);
}


module.exports = {
  broadcastRealtimeUsageUpdate: broadcastRealtimeUsageUpdate,
  broadcastDailyUsageUpdate: broadcastDailyUsageUpdate,
  broadcastMonthlyUsageUpdate: broadcastMonthlyUsageUpdate,
  broadcastPowerStateUpdate: broadcastPowerStateUpdate,
  generatePayload: generatePayload
}