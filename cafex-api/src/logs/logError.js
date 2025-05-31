const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'error.log');

function logError(err) {
  const msg = `[${new Date().toISOString()}] ${err.stack || err.message}\n`;
  fs.appendFileSync(logPath, msg);
}

module.exports = { logError };
