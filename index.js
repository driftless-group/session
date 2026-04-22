const path = require('path');

if (process.env.REDIS_URL != undefined) {
  module.exports = require(path.join(__dirname, 'redis'));
} else if (process.env.MONGO_URL != undefined) {
  module.exports = require(path.join(__dirname, 'mongodb'));
} else {
  console.log("You have missing env variables");
  console.log('Please set either the REDIS_URL or the MONGO_URL.')
  
  // The REDIS_URL is given priority in this file because
  // moving load from mongodb was the point of making the redis
  // session in the first place.

  // to choose one of the versions directly just require
  // requrie('@drifted/session/redis');
  // or
  // require('@drifted/session/mongodb');
}

