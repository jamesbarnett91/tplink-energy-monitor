var dash = {
  realtimeUsagePollRateMs: 1000,
  powerStatePollRateMs: 10000,
  pollingEnabled: true,

  realtimeGauge: null,
  realtimeTrendChart: null,
  realtimeTrendLastSample: 0,

  dailyUsageChart: null,
  monthlyUsageChart: null,

  init: function() {
    this.initRealtimeGauge();
    this.initRealtimeTrendChart();
    this.initDailyUsageChart();
    this.initMonthlyUsageChart();
    
    this.startPolling();
    this.getDailyUsageData();
    this.getMonthlyUsageData();
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

  initDailyUsageChart: function() {
    var ctx = document.getElementById('du-chart').getContext('2d');
    this.dailyUsageChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: "Energy (kWH)",
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          data: []
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
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

  initMonthlyUsageChart: function() {
    var ctx = document.getElementById('mu-chart').getContext('2d');
    this.monthlyUsageChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: "Energy (kWH)",
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          data: []
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
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
  pollUsage: function() {
    if(this.pollingEnabled) {
      $.ajax({
        url: "/energy-usage/1/realtime",
        type: "GET",
        success: function(data) {
          dash.refreshRealtimeDisplay(data);
        },
        dataType: "json",
        complete: setTimeout(function() {dash.pollUsage()}, dash.realtimeUsagePollRateMs),
        timeout: 2000
      });
    }
  },

  refreshRealtimeDisplay: function(realtime) {

    var power = Math.round(realtime.power);
    var current = realtime.current.toFixed(2);
    var voltage = Math.round(realtime.voltage);

    this.realtimeGauge.set(power);
    // might switch to Vue.js if this gets tedious 
    $("#rtu-power").text(power + " W")
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
    
    this.pollUsage();
    this.pollPowerStatus();
  },

  stopPolling: function() {
    this.pollingEnabled = false;
    this.realtimeTrendChart.options.plugins.streaming = false;
  },

  getDailyUsageData: function() {
    $.ajax({
      url: "/energy-usage/1/day-stats",
      type: "GET",
      success: function(data) {
        dash.parseDailyUsageData(data);
      },
      dataType: "json",
      timeout: 4000
    });
  },

  parseDailyUsageData: function(usageData) {
    usageData.forEach(function(entry) {
      // Months from API response are 1 based
      var day = moment([entry.year, entry.month - 1, entry.day]);

      dash.dailyUsageChart.data.labels.push(day.format('MMM D'));
      dash.dailyUsageChart.data.datasets.forEach(function(dataset) {
        dataset.data.push(entry.energy);
      });
    });

    dash.dailyUsageChart.update();
  },

  getMonthlyUsageData: function() {
    $.ajax({
      url: "/energy-usage/1/month-stats",
      type: "GET",
      success: function(data) {
        dash.parseMonthlyUsageData(data);
      },
      dataType: "json",
      timeout: 4000
    });
  },

  parseMonthlyUsageData: function(usageData) {
    usageData.forEach(function(entry) {
      // Months from API response are 1 based
      var month = moment().month(entry.month -1);

      dash.monthlyUsageChart.data.labels.push(month.format('MMM'));
      dash.monthlyUsageChart.data.datasets.forEach(function(dataset) {
        dataset.data.push(entry.energy);
      });
    });

    dash.monthlyUsageChart.update();
  },

  pollPowerStatus: function() {
    if(this.pollingEnabled) {
      $.ajax({
        url: "/power-state/1",
        type: "GET",
        success: function(data) {
          dash.refreshPowerState(data);
        },
        dataType: "json",
        complete: setTimeout(function() {dash.pollPowerStatus()}, dash.powerStatePollRateMs),
        timeout: 2000
      });
    }
  },

  refreshPowerState: function(powerState) {
    if(powerState.isOn) {
      $("#power-state").text("ON").attr("class", "label label-success");
    }
    else {
      $("#power-state").text("OFF").attr("class", "label label-danger");
    }

    $("#uptime").text(moment.duration(powerState.uptime, "seconds").format("d [d] h [h] m [m]"));
  },

};


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
