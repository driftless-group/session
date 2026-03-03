const path = require('path');
const assert = require('assert')

process.env.NODE_ENV = 'test';



var Session = require(path.join(__dirname, '..', 'session'));


describe('session', function() {
  var id;

  it('initialize', function(done) {
    var session = new Session({id: undefined});
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
      done();
    })
  })

  it('unset', function(done) {
    var session = new Session({id});
    session.unset('unset').then(() => {
      done();
    })
  })
})



