const path = require('path');
let Session = require(path.join(__dirname, 'session'));

function SessionMiddleware(req, res, next) {
  Session.read(req.cookies.session).then((session) => {
    req.session = session;
    res.cookie('session', req.session.id, { maxAge: 3600000, httpOnly: true });

    next();
  }).catch(console.log)
}

module.exports = SessionMiddleware;

