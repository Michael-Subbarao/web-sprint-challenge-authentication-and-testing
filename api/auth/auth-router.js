const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./user-model')
const {JWT_SECRET} = require('../../config');
const {validate,usernameCheck, userNameExists} = require('./../middleware/auth')

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
}

router.post('/register', validate, usernameCheck,   async (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  const user = { username, password: hash }
 
  Users.add(user)
    .then(saved => {
      res.status(201).json({...saved, message: `Great to have you, ${saved.username}` })
    })
    .catch(next); 
})

router.post("/login", validate, userNameExists, async (req, res,next) => {
  let user = req.user;
  let { username,password } = req.body;
  try{
    if(bcrypt.compareSync(password, user.password))
    {
      res.status(200).json({
        message: `Welcome, ${username}`,
        token: generateToken(user),
       });
    }
    else {
      res.status(401).json({ message:"invalid credentials"});
    }
  }
  catch{
    res.status(401).json({ message:'Something went wrong here'});
  }
  next();
});

module.exports = router;
