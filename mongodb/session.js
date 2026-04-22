const path = require('path');
const crypto = require('crypto');
const { URL } = require('node:url');

let { connect  } = require(path.join(__dirname, 'client'));
const { ObjectId } = require('mongodb');

class Session {
  
  constructor(options={}) {
    Object.assign(this, options);
    
    if (typeof this._id == 'string') {
      this._id = new ObjectId(this._id);
    }
  }

  static clear() {
    var response, self = this;
    return new Promise((resolve, reject) => {
      connect().then(async(client) => {  
        try {
          const database = client.db(Session.database());
          const sessions = database.collection("sessions");
          response = await sessions.deleteMany({});
          
        } catch(error) {
          console.log(error);
        }
        await client.close();
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

  static read(_id) {
    return new Promise((resolve) => {
      var session = new Session({_id: _id})     
      session.read().then(() => {
        resolve(session);
      })
    })
  }

  unset(name) {
    var response, self = this;
    
    return new Promise((resolve, reject) => {
       connect().then(async(client) => {  
        try {

          const database = client.db(Session.database());
          const sessions = database.collection("sessions");
          const query = { _id: self._id };
          
          var updateDoc = {
            "$unset": {}
          }
          updateDoc['$unset'][name] = '';
          var ack = await sessions.updateOne(query, updateDoc);
          response = await sessions.findOne({_id: self._id});
        } catch(error) {
          console.log(error);
        }
        await client.close();
 
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
          const query = { _id: self._id };

          response = await sessions.findOne(query);

          if (response == null) {
            var ack = await sessions.insertOne({});
            response = await sessions.findOne({_id: ack.insertedId});
            self._id = ack.insertedId;
          }

          Object.assign(self, response);

        } catch(error) {
          console.log(error);
        }
        await client.close();
 
        resolve(response);

      })
    })   
  }

  obj() {
    var self = this;
    return Object.keys(this).filter((key) => { 
      return key != '_id'; 
    }).reduce((obj, key) => {
      obj[key] = self[key];

      return obj;
    }, {});
  }

  save() {
    var response, self = this;
    return new Promise((resolve, reject) => {
      connect().then(async(client) => {  
        try {
          const database = client.db(Session.database());
          const sessions = database.collection("sessions");
          const query = { _id: self._id };
         
          if (query._id != undefined) {
            const updateDoc = {
              $set: self.obj()
            };

            var ack = await sessions.updateOne(query, updateDoc);
            response = await sessions.findOne(query);
          } else {
            var ack = await sessions.insertOne(self.obj());
            response = await sessions.findOne({_id: ack.insertedId});
          }
          
        } catch(error) {
          console.log(error);
        }
        await client.close();
        resolve(response);

      })
    })
  }

}


module.exports = Session;


