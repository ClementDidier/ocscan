const util = require('util');
const exec = util.promisify(require('child_process').exec);


function initialize()
{
  // initialize
}

async function getDevices(callback)
{
  var { err, stdout, stderr } = await exec("scanimage -f \"{'index':'%i', 'device':'%d', 'type':'%t', 'model':'%m', 'constructor':'%v'}\"");
  var json = "[" + stdout.toString() + "]";
  json = json.replace(/\'/g, '"');
  callback(JSON.parse(json));
}

async function startScan(device, options, callback)
{
  var brightness = scanOpt(options, "brightness");
  var gammaTable = scanOpt(options, "gamma-table");
  var format = scanOpt(options, "format", "--format=png");

  var { err, stdout, stderr } = await exec("scanimage --device '" + device.toString() + "'" + brightness + gammaTable + " --format=png > scan.png");
  callback(stdout);
}

function scanOpt(options, name, def)
{
  return options && options[name] !== undefined ? " --" + name + " " + options[name] : (def || "");
}

module.exports = {
  initialize,
  getDevices,
  startScan
}
