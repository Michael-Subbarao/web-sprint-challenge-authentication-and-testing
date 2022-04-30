const Users = require('../../api/auth/user-model')

//middleware for login and register payload validation
const validate = (req,res,next) =>{
    const {username,password} = req.body;
    if(!username || !password){
        res.status(400).send({message: 'Missing username or password.'});
        next();
    }
    else if(password.length<4){
        res.status(400).send({message: 'Password must be at least 4 characters.'});
        next();
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
        res.status(400).send({message: 'Username or Password Incorrect'});
        next();
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
      next({ status: 401, message: 'Username or Password Incorrect'})
    }
  }


module.exports = {
    validate,
    usernameCheck,
    validateLogin,
    userNameExists
}