const redis = require('redis');

var { createClient } = require('redis');

if (process.env.REDIS_URL == undefined) {
  process.env.REDIS_URL = 'redis://localhost:6379'
}


let client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: (['test', 'development'].indexOf(process.env.NODE_ENV) > -1 ? false :  true),
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
    pingInterval: 240000,
    rejectUnauthorized: false
  }
}); 

client.on('error', (err) => console.error('redis:client:session:error', err));

client.connect();

module.exports = client;

