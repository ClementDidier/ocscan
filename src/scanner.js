const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

class Scanner
{
    async getDevices(callback)
    {
        var { err, stdout, stderr } = await exec("scanimage -f \"{'index':'%i', 'device':'%d', 'type':'%t', 'model':'%m', 'constructor':'%v'}\"");
        var json = "[" + stdout.toString() + "]";
        json = json.replace(/\'/g, '"');

        callback(JSON.parse(json));
    }

    async startScan(device, options, callback)
    {
        var brightness = scanOpt(options, "brightness");
        var gammaTable = scanOpt(options, "gamma-table");
        var format = scanOpt(options, "format", "--format=png");

        var scan =  await spawn("scanimage",["--progress", "--device", "'" + device.toString() + "'", brightness, gammaTable, format, " > /tmp/scan.png"]);

        scan.stdout.on('data', function (data) {
          console.log('stdout: ' + data.toString());
        });

        scan.stderr.on('data', function (data) {
          console.log('stderr: ' + data.toString());
        });

        scan.on('error', function (error) {
          console.log('error ' + error.toString());
        });

        scan.on('exit', function (code) {
          console.log('child process exited with code ' + code.toString());
        });

        callback(stdout);
    }
}

function scanOpt(options, name, def)
{
    return options && options[name] !== undefined ? " --" + name + " " + options[name] : (def || "");
}

module.exports = Scanner;
