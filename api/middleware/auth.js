const Users = require('../../api/auth/user-model')

//middleware for login and register payload validation
const validate = (req,res,next) =>{
    const {username,password} = req.body;
    console.log(username,password);
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
        if(!compare){
            next();
        }
        else{
            res.status(400).send({message: 'Username is Taken.'});
        }
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    validate,
    usernameCheck
}