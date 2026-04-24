const path = require('path');
const crypto = require('crypto');
const { URL } = require('node:url');

var AbstractSession = require(path.join(__dirname, '..', 'abstract'));
var client = require(path.join(__dirname, 'client'));

let { connect  } = require(path.join(__dirname, 'client'));
const { ObjectId } = require('mongodb');

class Session extends AbstractSession {
  static clear() {
    var response, self = this;
    return new Promise((resolve, reject) => {
      connect().then(async(client) => {  
        try {
          const database = client.db(self.class().database());
          const sessions = database.collection("sessions");
          response = await sessions.deleteMany({});
          
        } catch(error) {
          console.log(error);
        }
      
        resolve(response);
      })
    })
  }

  static client() {
    return connect();
  }

  static database() {
    return this.connection().pathname.replace('/', '');
  }

  static connection() {
    return new URL(process.env.MONGO_URL)
  }
  
  static class() {
    return Session
  }

  static read(_id) {
    var self = this;
    return new Promise((resolve) => {
      var session = new self({_id: _id})     
      session.read().then(() => {
        resolve(session);
      })
    })
  }

  remove(name) {
    var response, self = this;
    
    return new Promise((resolve, reject) => {
      connect().then(async(client) => {  
        const database = client.db(Session.database());
        const sessions = database.collection("sessions");
        const query = { _id: new ObjectId(self._id) };

        var doc = await sessions.findOne({_id: new ObjectId(self._id) });

        if (doc.encryptedData == undefined && doc.iv == undefined) {
          var updateDoc = {
            "$unset": {}
          }
          updateDoc['$unset'][name] = '';
          
          var ack = await sessions.updateOne(query, updateDoc);
          delete self[name];
          Object.assign(self, self.process(response));
        } else {
          var processed = self.process(doc);

          delete processed[name];
          delete self[name];
          Object.assign(self, processed);

          var ack = await sessions.updateOne(query, { $set: self.prepare(processed) })
          var response = await sessions.findOne({_id: new ObjectId(self._id) });
          Object.assign(self, processed);
        }
        
        self.read().then(() => {
          resolve();
        })
      })
    })   
  }

  read() {
    var self = this;
    var response;

    return new Promise(async(resolve, reject) => {
      connect().then(async(client) => {  
        try {

          const database = client.db(Session.database());
          const sessions = database.collection("sessions");
          const query = { _id: new ObjectId(self._id) };

          response = await sessions.findOne(query);

          if (response == null) {
            var ack = await sessions.insertOne({});
            response = await sessions.findOne({_id: ack.insertedId});

            self._id = ack.insertedId;
          }

          var processed = self.process(response);
          Object.assign(self, processed);

        } catch(error) {
          console.log(error);
        }
 
        resolve(response);

      })
    })   
  }

  save() {
    var response, self = this;
    return new Promise((resolve, reject) => {
      connect().then(async(client) => {  
        try {
          const database = client.db(Session.database());
          const sessions = database.collection("sessions");
          const query = { _id: new ObjectId(self._id) };

          if (query._id != undefined) {
            const updateDoc = {
              $set: self.prepare()
            };

            var ack = await sessions.updateOne(query, updateDoc);
            response = await sessions.findOne(query);
          } else {
            var ack = await sessions.insertOne(self.prepare());
            response = await sessions.findOne({_id: ack.insertedId});
          }
          
          Object.assign(self, self.process(response));
        } catch(error) {
          console.log(error);
        }
      
        resolve(self);
      })
    })
  }

}


module.exports = Session;


