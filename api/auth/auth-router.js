const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./user-model')
const {JWT_SECRET} = require('./../../config');
const {validate,usernameCheck} = require('./../middleware/auth')

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
}

router.post('/register', validate, usernameCheck, (req, res, next) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 6);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({ message: `Great to have you, ${saved.username}` })
    })
    .catch(next); 
})

router.post('/login',  (req, res, next) => {
//  let { username, password } = req.body;
//  Users.findBy({ username })
//    .then(([user]) => {
//      if (user && bcrypt.compareSync(password, user.password)) {
//        res.status(200).json({
//          message: `Welcome, ${user.username}`,
//          token: generateToken(user)
//        })
//      } else {
//        next({ status: 401, message: 'Username or Password Incorrect' })
//      }
//    })
//    .catch(next)
  const user = req.user
  const { password } = req.body
  const validCreds = bcrypt.compareSync(password, user.password)

  if (validCreds) {
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token: generateToken(user)
    })
  } else {
    next({ status: 401, message: 'Username or Password Incorrect' })
  }
  
})

module.exports = router;
