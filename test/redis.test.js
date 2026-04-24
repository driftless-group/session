const path = require('path');
const assert = require('assert');

var {
  exception
} = require('@drifted/qa');

require('@drifted/env/test');
var Session = require(path.join(__dirname, '..', 'redis', 'session'));

describe('session:redis', function() {
  var id;
  
  after((done) => {
    Session.clear().then(() => {
      done();
    }).catch(exception(done));
  })

  it('read', function(done) {
    Session.read(id).then((session) => {
      assert.notEqual(session.id, undefined);
      done();
    })
  })

  it('initialize', function(done) {
    var session = new Session();
    id = session.id;
    session.user_id = 'test'
    
    session.save().then(() => {
      done()
    }).catch((err) => {
      done();
    });
  });

  it('reinit', function(done) {
    var session = new Session({id});
    session.read().then(() => {
      assert.equal(session.user_id, 'test');
      done();
    })
  })

  it('unset', function(done) {
    var session = new Session({id});
    session.unset('user_id').then(() => {
      assert.equal(session.user_id, undefined);
      session.read().then(() => {
        assert.equal(session.user_id, undefined);
        done();
      })
    })
  })
})



