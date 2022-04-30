const Users = require('../../api/auth/user-model')

//middleware for login and register payload validation
const validate = (req,res,next) =>{
    const {username,password} = req.body;
    if(!username || !password){
        res.status(400).send({message: 'username and password required.'});
        res.end();
    }
    else{
        next();
    }
}

const usernameCheck = async (req,res,next) =>{
    try{
        const compare = await Users.findByUsername(req.body.username);
        if(compare){
            res.status(400).send({message: 'Username is Taken.'});
        }
        else{
            next();
        }
    }
    catch(err){
        next(err)
    }
}

const validateLogin = (req,res,next)=>{
    const {username,password} = req.body;
    if(!username || !password){
        res.status(400).send({message: "username and password required"});
        res.end();
    }
    next();
}

const userNameExists = async (req, res, next) => {
    const { username } = req.body
    const user = await Users.findByUsername((username));
    if (user) {
      req.user = user;
      next();
    } else {
      next({ status: 401, message: "invalid credentials"})
    }
  }


module.exports = {
    validate,
    usernameCheck,
    validateLogin,
    userNameExists
}