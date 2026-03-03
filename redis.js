const redis = require('redis');

var { createClient } = require('redis');

if (process.env.REDIS_URL == undefined) {
  process.env.REDIS_URL = 'redis://localhost:6379'
}


let client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: (['test', 'development'].indexOf(process.env.NODE_ENV) > -1 ? false :  true),
    rejectUnauthorized: false
  }
}); 

client.connect();

module.exports = client;

