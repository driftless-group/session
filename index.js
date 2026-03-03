const path = require('path');
let Session = require(path.join(__dirname, 'session'));

function SessionMiddleware(req, res, next) {
  req.session = new Session({id: req.cookies.session});
  res.cookie('session', req.session.id, { maxAge: 3600000, httpOnly: true });

  req.session.read().then(() => {
    next();
  }).catch(console.log)
}

module.exports = SessionMiddleware;

