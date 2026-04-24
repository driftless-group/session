const path = require('path');
const Session = require(path.join(__dirname, '..', 'session'));
const encryption = require(path.join(__dirname, '..', '..', 'encryption'));

class HashedSession extends Session {
  
  secret() {
    return encryption.secret();
  }

  encrypt(text) {
    return encryption.encrypt(text);
  }

  decrypt(obj) {
    return encryption.decrypt(obj);
  }

  process(obj) {
    return encryption.process(obj);
  }

  prepare() {
    return encryption.prepare(this.saveable());
  }  

}


module.exports = HashedSession;
