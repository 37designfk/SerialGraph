'use strict';

// setup
const serverPort = 3000;
const comPort = 'COM11';

// file system
const fs = require('fs');

// serial port settings
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});
const port = new SerialPort(comPort, {
    baudRate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1,
    rtscts: true,
});
port.pipe(parser);

// socket.io server setup
var app = require('http').createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('index.html'));
}).listen(serverPort);
var io = require('socket.io').listen(app);


port.on('open', () => {
    console.log('Open ' + comPort);
});
parser.on('data', (data) => {
    console.log(data.toString());
    io.sockets.emit('raw', data.toString());
});