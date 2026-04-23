const path = require('path');
const assert = require('assert')

require('@drifted/env/test');
require('@drifted/db');
var mongoose = require('mongoose');
const crypto = require('crypto');
var {
  exception
} = require('@drifted/qa');

process.env.SECRET = crypto.randomBytes(32);

var Session = require(path.join(__dirname, '..', 'mongodb', 'hash', 'session'));

describe('session:mongodb:hash', function() {
  var _id;

  after((done) => {
    Session.clear().then(() => {
      done();
    })
  })

  it('read', function(done) {
    Session.read(_id).then((session) => {
      _id = session._id;
      done();
    }).catch(exception(done))
  })

  
  it('initialize', function(done) {

    var session = new Session({_id: _id});
    _id = session._id;
    session.user_id = 'test'
    session.test = true
    session.save().then(() => {
      //console.log(session);
      assert.equal(session.user_id, 'test');
      done()
    }).catch((err) => {
      console.log(err);
      done();
    });
  });


  it('reinit', function(done) {
    var session = new Session({_id});
    session.read().then(() => {
      done();
    })
  })

  xit('unset', function(done) {
    var session = new Session({_id});
    session.unset('user_id').then(() => {
      done();
    })
  })
})



