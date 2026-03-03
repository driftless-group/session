const path = require('path');
const assert = require('assert')

process.env.NODE_ENV = 'test';

var cookieParser = require('cookie-parser');
const { appInstance, drive, supertest } = require('@drifted/qa');
var Session = require(path.join(__dirname, '..', 'session'));


describe('session:middleware', function() {
  var app = appInstance({csrf: true});

  var server;
  app.use(cookieParser())
  app.use(require(path.join(__dirname, '..')));

  app.get('/', function(req, res) {
    if (req.session.count == undefined) {
      req.session.count = 0;
    }

    req.session.count += 1;
    req.session.save().then(() => {
      res.json(req.session);
    })
  })

  app.get('/count', function(req, res) {
    res.json(req.session);
  })

  before((done) => {
    //server = app.listen(9999);
    done()
  })

  after(function(done) {
    //server.close()
    done()
  })


  it('check to see if a cookie gets created.', function(done) {
    var id;
    supertest(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        var json = JSON.parse(res.text);
        id = json.id
      

        supertest(app)
          .get('/count')
          .expect(200)
          .set("Cookie", ['session', json.id].join('='))
          .end(function(err, res) {
            if (err) throw err;
            var json = JSON.parse(res.text);
            assert.equal(json.count, 1)

            done();
          });
      });
  })


})



