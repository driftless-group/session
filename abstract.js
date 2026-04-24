const path = require('path');



class AbstractSession {
  constructor(options={}) {
    Object.assign(this, options);
    if (this.id == undefined) {
      this.id = this.generateId();
    }  
  }

  prefix() {
    return 'sessions';
  }

  generateId() {
    return [
      this.prefix(),
      crypto.randomUUID()
    ].join(':');
  }

  static read(id) {
    var self = this;
    return new Promise((resolve) => {
      var session = new self({id: id})     
      session.read().then(() => {
        resolve(session);
      }).catch(console.log);
    })
  }

  process(obj) {
    return obj;
  }

  saveable() {
    var self = this;
    return Object.keys(this).filter((key) => { 
      return key != '_id'; 
    }).reduce((obj, key) => {
      obj[key] = self[key];

      return obj;
    }, {});
  }

  prepare() {
    return this.saveable();
  }

}



module.exports = AbstractSession;


