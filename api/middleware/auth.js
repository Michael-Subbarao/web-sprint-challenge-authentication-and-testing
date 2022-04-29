const Users = require('./../../data/dbConfig')

//middleware for login and register payload validation
const validate = async (req,res,next) =>{
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
        const compare = await Users.findByUser(req.body.username);
        if(!compare){
            next();
        }
        else{
            next({status:400, message:'Username is Taken'});
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