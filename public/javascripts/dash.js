var dash = {
  pollRateMs: 1000,
  pollingEnabled: true,

  realtimeGauge: null,
  realtimeTrendChart: null,
  realtimeTrendLastSample: 0,

  init: function() {
    this.initRealtimeGauge();
    this.initRealtimeTrendChart();
    this.startPolling();
  },

  initRealtimeGauge: function() {
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
  
    dash.realtimeGauge = new Gauge(target).setOptions(opts);
    dash.realtimeGauge.maxValue = 3000;
    dash.realtimeGauge.setMinValue(0);
    dash.realtimeGauge.animationSpeed = 32;
  },

  initRealtimeTrendChart: function() {
    var ctx = document.getElementById('rtt-chart').getContext('2d');
    this.realtimeTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: "Power (W)",
          borderColor: 'rgb(255, 99, 132)',
          data: []
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            type: 'realtime'
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        },
        maintainAspectRatio: false,
        tooltips: {
          intersect: false
        },
      }
    });
  },

  realtimeTrendChartOnRefresh: function(chart) {
    chart.data.datasets.forEach(function(dataset) {
      dataset.data.push({
        x: Date.now(),
        y: dash.realtimeTrendLastSample
      });
    });
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
        complete: setTimeout(function() {dash.poll()}, dash.pollRateMs),
        timeout: 2000
      });
    }
  },

  refreshDashboard: function(realtime) {

    var power = Math.round(realtime.power);
    var current = realtime.current.toFixed(2);
    var voltage = Math.round(realtime.voltage);

    this.realtimeGauge.set(power);
    // might switch to Vue.js if this gets tedious 
    $("#rtu-power").text(power + " kW")
    $("#rtu-current").text(current + " A")
    $("#rtu-voltage").text(voltage + " V")

    this.realtimeTrendLastSample = power;
  },

  startPolling: function() {
    this.pollingEnabled = true;
    this.realtimeTrendChart.options.plugins.streaming = {
      duration: 60000,
      refresh: 1000,
      delay: 1000,
      frameRate: 30,
      onRefresh: dash.realtimeTrendChartOnRefresh
    };
    this.poll();
  },

  stopPolling: function() {
    this.pollingEnabled = false;
    this.realtimeTrendChart.options.plugins.streaming = false;
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
  });

});
