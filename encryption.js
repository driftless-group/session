const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';



function kdf(input) {
  var buf = Buffer.from(input, 'utf8');
  return Buffer.concat([buf], 32);  
}
module.exports.kdf = kdf;



function secret() {
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
module.exports.secret = secret;



function encrypt(text) {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, kdf(secret()), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
module.exports.encrypt = encrypt;



function decrypt(obj) {
  if (obj.iv != undefined && obj.encryptedData != undefined) {
    const decipher = crypto.createDecipheriv(algorithm, kdf(secret(), 'hex'), Buffer.from(obj.iv, 'hex'));

    let decrypted = decipher.update(obj.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } else {
    return JSON.stringify(obj);
  }
}
module.exports.decrypt = decrypt;



function processor(obj) {
  return JSON.parse(decrypt(obj));
}
module.exports.process = processor;



function prepare(obj) {
  return encrypt(JSON.stringify(obj))
}  
module.exports.prepare = prepare;


