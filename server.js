'use strict';

// setup
const comPort = 'COM11';
var http = require("http");

// file system
const fs = require('fs');

// serial port settings
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});
const comport = new SerialPort(comPort, {
    baudRate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1,
    rtscts: true,
});
comport.pipe(parser);

// socket.io server setup
var server = http.createServer(function (req, res) {
    var url = "public" + (req.url.endsWith("/") ? req.url + "index.html" : req.url);
  if (fs.existsSync(url)) {
    fs.readFile(url, (err, data) => {
      if (!err) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data);
      }
    });
  }
});

var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


comport.on('open', () => {
    console.log('Open ' + comPort);
});
parser.on('data', (data) => {
    console.log(data.toString());
    io.sockets.emit('raw', data.toString());
});