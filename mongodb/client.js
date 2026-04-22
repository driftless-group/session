const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');

var connections = {};

function connect(name='default') {
  return new Promise(async(resolve) => {
    if (connections[name] == undefined || 
       (connections[name] != undefined && 
        connections[name].s.hasBeenClosed == true)) {
      
        // i don't know if this has been closed 
        // stuff is the right way to detect this.

      var client = new MongoClient(process.env.MONGO_URL, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await client.connect();
      connections[name] = client;

      resolve(client);
    } else {
      
      resolve(connections[name]);
    }
  })
}

module.exports.ObjectId;
module.exports.connect = connect;


