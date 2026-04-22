const path = require('path');
const crypto = require('crypto');

let client = require(path.join(__dirname, 'client'));

class Session {
  
  constructor(options={}) {
    Object.assign(this, options);
    if (this.id == undefined) {
      this.id = crypto.randomUUID();
    }  
  }

  static read(id) {
    return new Promise((resolve) => {
      var session = new Session({id: id})     
      session.read().then(() => {
        resolve(session);
      }).catch(console.log);
    })
  }

  unset(name) {
    var self = this;
    return new Promise((resolve, reject) => {
      client.hDel(self.id, name).then((response) => {
        self.read().then(() => {
          resolve();
        })
      }).catch(reject);
    })   
  }

  read() {
    var self = this;
    return new Promise((resolve, reject) => {
      client.hGetAll(self.id).then((response) => {
        Object.assign(self, response)
        resolve();
      }).catch(reject);
    })   
  }

  obj() {
    var self = this;
    return Object.keys(this).filter((key) => { return key != 'id' }).reduce((obj, key) => {
      obj[key] = self[key];

      return obj;
    }, {});
  }

  save() {
    var self = this;
    return new Promise((resolve, reject) => {
      client.hSet(self.id, self.obj()).then(() => {
        resolve();
      }).catch(reject);
    })
  }

}


module.exports = Session;


