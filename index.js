const path = require('path');
if (process.env.REDIS_URL != undefined) {
  module.exports = require(path.join(__dirname, 'redis'));
} else {
  module.exports = require(path.join(__dirname, 'mongodb'));
}

