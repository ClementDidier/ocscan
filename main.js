const http = require('http');
const fs = require('fs');
const io = require('socket.io').listen(server);

const Executor = require('./src/executor');
const Scanner = require('./src/scanner');
const PictureAnalyser = require('./src/picture');

var executor = new Executor();
var scanner = new Scanner();
var picture = new PictureAnalyser();

var server = http.createServer(function(req, res) {
    fs.readFile('./src/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        picture.getSimilarityRate('img/logo1.png', 'img/logo2.png', function(result) {
          res.write(content);
          res.write("Similarity : " + result)
          res.end();
        });
    });
});

io.sockets.on('connection', function (socket)
{
    socket.on('devices', function()
    {
        scanner.getDevices(function(devices)
        {
            socket.emit('devices', devices);
        });
    });

    // args : {"device":"deviceName", "options":["brightness":"50", ...]} <JSON>
    socket.on('scan', function(a)
    {
        // TODO : Verify options before start scan
        // if 'a' valide then
        var args = JSON.parse(a);
        executor.enqueue(scanner.startScan, this, [args.device, args.options, scanFinished]);
    });
});

function scanFinished(message)
{
  console.log("Scan finished : " + message);
}

server.listen(8080);
