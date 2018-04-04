# TPLink Energy Monitor
[![Build Status](https://travis-ci.org/jamesbarnett91/tplink-energy-monitor.svg?branch=master)](https://travis-ci.org/jamesbarnett91/tplink-energy-monitor)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=tplink-monitor&metric=alert_status)](https://sonarcloud.io/dashboard?id=tplink-monitor)

A web based monitoring dashboard displaying energy usage data and statistics for TP-Link HS110 smart plugs.

Written in Node.js + Express, and fully responsive so works well on mobile devices.

<p align="center">
  <img alt="Screenshot" src="https://james-barnett.net/files/tplink-monitor/screenshots/em-res.png">
</p>

# Features
- Automatically scans for TP-Link smart plug devices on your local network on server start.
- Realtime current, voltage, power readings.
- Recent power usage trend chart.
- Plug on/off state and uptime.
- Daily & monthly energy usage totals and averages.
- Historical daily and monthly energy usage charts.

# Setup
You can use any of the following methods to get the project running:

### Packaged executable
The easiest way to run the project is to download one of the packaged executables from the [releases page](https://github.com/jamesbarnett91/tplink-monitor/releases). These are single file executables with all dependencies included. Just download the relevant file for your OS (Windows, Linux and MacOS available) and double click the file. Then go to `localhost:3000` in your browser to access the dashboard.

### Docker
Alternatively, you can pull the `jbarnett/tplink-energy-monitor` image and run that.
Note that because the server needs access to your local network to scan for TP-Link devices, you must run the image using [host networking](https://docs.docker.com/network/host/) e.g.:
```
$ docker run -d --network host jbarnett/tplink-energy-monitor
```

### Node + NPM

To run directly via NPM:
```sh
$ git clone https://github.com/jamesbarnett91/tplink-energy-monitor && cd tplink-energy-monitor
$ npm install
$ npm start
```

### Note
Because the server needs access to your local network to scan for TP-Link device, you must run the server on the same network which your TP Link plugs are connected to. For the vast majority of people this shouldn't be an issue, and you can still use different network interfaces (i.e. plug(s) on WiFi and server on ethernet) as long as they all connect to the same network.

A note for Windows users: There seems to be an issue with the UDP broadcast the server performs to scan for devices which occurs when you also have VirtualBox installed on your Windows machine. I think this is because the response from the plug is routed to the VirtualBox Host-Only network adapter, rather than your primary network interface (for some reason). 

If you hit this issue you can try disabling the VirtualBox adapter in `Control Panel > Network and Internet > Network Connections` and see if that solves the problem.

# TODOs
- [x] Show historical data
- [x] Build dists
- [x] Docker image
- [ ] Support switching between multiple plugs (currently only works for the fist plug discovered)
- [ ] Rescan for devices on the fly
- [ ] Add daily cost metrics
- [ ] Configurable poll rates
- [ ] Switch to websockets


