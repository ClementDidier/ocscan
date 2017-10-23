const http = require('http');
const fs = require('fs');
const scannerhdlr = require('./src/scanner-handler');

var server = http.createServer(function(req, res) {
    fs.readFile('./src/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

const io = require('socket.io').listen(server);

// TODO : Handle all request in queue !

io.sockets.on('connection', function (socket)
{
  socket.on('devices', function()
  {
    scannerhdlr.getDevices(function(devices)
    {
      socket.emit('devices', devices);
    });
  });

  // options : {"brightness":"50", ...} <JSON>
  // TODO : Verify options before start scan
  socket.on('scan', function(options)
  {
    scannerhdlr.getDevices(function(devices)
    {
      var opt = JSON.parse(options);
      scannerhdlr.startScan(devices[0].device, opt, scanFinished);
    });
  });
});

function scanFinished(message)
{
  console.log("Scan finished : " + message);
}

server.listen(8080);
