var dash = {
  pollRateMs: 1000,
  pollingEnabled: true,
  realtimeGuage: null,

  init: function() {
    this.initRealtimeGuage();
    this.startPolling();
  },

  initRealtimeGuage: function() {
    var opts = {
      angle: 0,
      lineWidth: 0.2,
      pointer: {
        length: 0.6,
        strokeWidth: 0.035,
        color: '#000000'
      },
      limitMax: true,
      limitMin: true,
      generateGradient: true,
      highDpiSupport: true, 
      staticLabels: {
        font: "12px sans-serif",
        labels: [500, 1500, 3000]
      },
      staticZones: [
        { strokeStyle: "#30B32D", min: 0, max: 500 },
        { strokeStyle: "#FFDD00", min: 500, max: 1500 },
        { strokeStyle: "#F03E3E", min: 1500, max: 3000 }
      ]
    };
    var target = document.getElementById('rtu-gauge');
  
    dash.realtimeGuage = new Gauge(target).setOptions(opts);
    dash.realtimeGuage.maxValue = 3000;
    dash.realtimeGuage.setMinValue(0);
    dash.realtimeGuage.animationSpeed = 32;
    dash.realtimeGuage.set(500);
  },

  // TODO - should probably use websockets 
  poll: function() {
    if(this.pollingEnabled) {
      $.ajax({
        url: "/energy-usage/1/realtime",
        type: "GET",
        success: function(data) {
          dash.refreshDashboard(data);
        },
        dataType: "json",
        complete: setTimeout(function() {dash.poll()}, 1000),
        timeout: 2000
      });
    }
  },

  refreshDashboard: function(realtime) {

    var power = Math.round(realtime.power);
    var current = realtime.current.toFixed(2);
    var voltage = Math.round(realtime.voltage);

    this.realtimeGuage.set(power);
    // might switch to Vue.js is this gets tedious 
    $("#rtu-power").text(power + " kW")
    $("#rtu-current").text(current + " A")
    $("#rtu-voltage").text(voltage + " V")
    
  },

  startPolling: function() {
    this.pollingEnabled = true;
    this.poll();
  },

  stopPolling: function() {
    this.pollingEnabled = false;
  },

}


$(document).ready(function () {
  dash.init();
  $("#toggle-polling").change(function() {
    if(this.checked) {
      dash.startPolling();
    }
    else {
      dash.stopPolling();
    }
  })
});
