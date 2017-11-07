const Scanner = require('../src/scanner');
const Executor = require('../src/executor');

var executor = new Executor();
var scanner = new Scanner();

executor.enqueue(scanner.getDevices, this, [function(message) { console.log(message); }]);
executor.enqueue(scanner.getDevices, this, [function(message) { console.log(message); }]);

executor.start();
