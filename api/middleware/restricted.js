const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./../../config");
const User = require('./../../data/dbConfig')


module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if(err) {
      console.log('Error:', err)
      next({ status: 401, message: 'token required' });
      return;
    }

    const user = await User.findById(decodedToken.subject);
    if(decodedToken.iat < user.logged_out_time) {
      next({ status: 401, message: 'token invalid' });
      return;
    }

    req.decodedJwt = decodedToken;
    console.log('decoded token:', req.decodedJwt);
    next();
  })
}