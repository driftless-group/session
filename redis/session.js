const path = require('path');
const crypto = require('crypto');

var AbstractSession = require(path.join(__dirname, '..', 'abstract'));
var client = require(path.join(__dirname, 'client'));

class Session extends AbstractSession {
  
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
        Object.assign(self, self.process(response))
        resolve();
      }).catch(reject);
    })   
  }

  save() {
    var self = this;
    return new Promise((resolve, reject) => {
      client.hSet(self.id, self.prepare()).then(() => {
        resolve();
      }).catch(reject);
    })
  }

}


module.exports = Session;


