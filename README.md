# TPLink Monitor

A web based monitoring dashboard displaying energy usage data and statistics for TP-Link HS110 smart plugs.
Written in Node.js + Express.

<p align="center">
  <img alt="Screenshot" src="https://james-barnett.net/files/tplink-monitor/screenshots/em-res.png">
</p>

# Features
- Automatically scans for TP-Link smart plug devices on your local network on server start.
- Realtime current, voltage, power readings.
- Recent power usage trend chart.
- Plug on/off state and uptime.
- Daily & montly energy usage totals and averages.
- Historical daily and monthly energy usage charts.

# Installation
Prepacked releases comming soon.
For now:
```sh
$ git clone https://github.com/jamesbarnett91/tplink-monitor && cd tplink-monitor
$ npm install
$ npm start
```

# TODOs
- [x] Show historical data
- [ ] Switch to websockets
- [ ] Rescan for devices on the fly
- [ ] Build dists
- [ ] Docker image
- [ ] Support switching between multiple plugs
