const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');


function connect() {
  return new Promise(async(resolve) => {
    var client = new MongoClient(process.env.MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    resolve(client);
  })
}

module.exports.ObjectId;
module.exports.connect = connect;


