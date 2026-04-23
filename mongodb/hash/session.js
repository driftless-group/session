const path = require('path');
const Session = require(path.join(__dirname, '..', 'session'));
const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-cbc';

class HashedSession extends Session {

  static read(_id) {
    var self = this;
    return new Promise((resolve) => {
      var session = new HashedSession({_id: _id})     
      session.read().then(() => {
        resolve(session);
      })
    })
  }

  kdf(input) {
    var buf = Buffer.from(input, 'utf8');
    return Buffer.concat([buf], 32);  
  }

  secret() {
    var file =  path.join(process.cwd(), 'config', 'secret.json');
    var exists = fs.existsSync(file);


    if (exists) {
      return JSON.parse(fs.readFileSync(file).toString()).secret;
    } else if (process.env.SECRET != undefined) {

      return process.env.SECRET;
    } else {
      console.log('To use encrypted sessions ');
      console.log('  you must use a ');
      console.log('  SECRET env variable '); 
      console.log('  or a secret.json file. ')
    }
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, this.kdf(this.secret()), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  decrypt(obj) {
    if (obj.iv != undefined && obj.encryptedData != undefined) {
      const decipher = crypto.createDecipheriv(algorithm, this.kdf(this.secret(), 'hex'), Buffer.from(obj.iv, 'hex'));

      let decrypted = decipher.update(obj.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } else {
      return JSON.stringify(obj);
    }
  }

  process(obj) {
    return JSON.parse(this.decrypt(obj));
  }

  prepare() {
    return this.encrypt(JSON.stringify(this.obj()))
  }  

}


module.exports = HashedSession;
