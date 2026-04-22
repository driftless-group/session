const path = require('path');
const assert = require('assert')

require('@drifted/env/test');
require('@drifted/db');
var mongoose = require('mongoose');

var Session = require(path.join(__dirname, '..', 'mongodb', 'session'));

describe('session:mongodb', function() {
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
    })
  })

  
  it('initialize', function(done) {

    var session = new Session({_id: _id});
    _id = session._id;
    session.user_id = 'test'

    session.save().then(() => {
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

  it('unset', function(done) {
    var session = new Session({_id});
    session.unset('user_id').then(() => {
      done();
    })
  })
})



