const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../model/userModel");
const isAuthenticated = async (req,res,next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.status(404).json({
            message : "Please login"
        })
    }

    //Token pathayexi k garne logic
    //Verify if the token is legit
    // jwt.verify(token,process.env.SECRET_KEY,(err,sucess)=>{
    //     if(err){
    //         res.status(404).json({
    //             message : "Invalid token"
    //         })
    //     }else {
    //         res.status(201).json({
    //             message : "Token Verified"
    //         })
    //     }
    // })

    //ALternative to verify the token

     //Check if the decoded.id(userId) exists in the user table
    
   try {
    const decoded = await promisify(jwt.verify)(token,process.env.SECRET_KEY)
    
    const doesUserExists = await User.findOne({_id : decoded.id})

    if(!doesUserExists){
        return res.status(404).json({
            message : "User doesnot exists with this token id"
        })
    }
    req.user = doesUserExists
    next()
    
} catch (error) {
     res.status(404).json({
        message : error.message
    })
}

}

module.exports = isAuthenticated