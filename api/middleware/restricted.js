const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./../../config");


module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token === undefined) {
    res.status(401).json({ message: 'token required' })
  } else {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({message: 'token invalid'});
        next();
      } else {
        req.decodedToken = decodedToken;
        next()
      }
    })
  }
 };