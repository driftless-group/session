const path = require('path');
let Session = require(path.join(__dirname, 'session'));

function SessionMiddleware(req, res, next) {
  Session.read(req.cookies.session).then((session) => {
    req.session = session;
    res.cookie('session', req.session._id, { maxAge: 3600000, httpOnly: true });
    
    next();
  })
}

module.exports = SessionMiddleware;

