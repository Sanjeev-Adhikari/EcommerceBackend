//requiring bcrypt for hasing the password
const bcrypt = require("bcryptjs")

//requiring jsonwebtoken for making tokens for users
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

//Register user logic
exports.registerUser  = async (req,res)=>{

    const {email, password, userName, phoneNumber} = req.body
 
    if(!email || !password || !userName || !phoneNumber ){
     return res.status(404).json({
         mesage : "Please enter all the required fields"
     })
    }
 
    const userFound = await User.find({userEmail : email})
    if(userFound.length > 0){
     return res.status(404).json({
         message : "User with this email already exists"
     })
    }
 
 //    else {
    const userData = await User.create ({
         userName : userName,
         userPhoneNumber : phoneNumber,
         userEmail : email,
         userPassword : bcrypt.hashSync(password, 10)
     })
     res.status(201).json ({
         message : "User created successfully",
         data : userData
     })
    
 }

 //login user logic
 exports.loginUser = async (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(401).json({
            message: "Please provide email and password to login"
        })
    }
    
    //check if the email exists or not
    const userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
        return res.status(401).json({
            message : "User with that email is not registered"
        })
    }

    //check if the password is right
    const isMatched = bcrypt.compareSync(password,userFound[0].userPassword)
    if(isMatched){

    //Generate Token here
    const token = jwt.sign({id: userFound[0]._id},process.env.SECRET_KEY,{
        expiresIn : "30d"
    })


        res.status(201).json({
            message : "User logged in successfully",
            data : userFound,
            token : token
        })
    }else{
        res.status(404).json({
            message : "Invalid email or password"
        })
    }
     
}

//FORGOT PASSWORD AND GENERATE OTP LOGIC HERE
exports.forgotPassword = async (req,res)=>{
    const {email} = req.body
    if(!email){
       return res.status(404).json({
            message : "please enter your email here"
        })
    }

    //check if email is available or not
    const userExist = await User.find({userEmail : email})
    if(userExist.length == 0){
        return res.status(201).json({
            message : "Email is not registered"
        })
    }

    //send otp to that registered email
    const otp = Math.floor(1000 + Math.random() * 9000);
    //saving the otp for verification
    userExist[0].otp = otp
    await userExist[0].save()
    
    await sendEmail({
        email: email,
        subject: "Your OTP for digitalMomo forgotPassword",
        message: `Your OTP is ${otp}`
    })
    res.status(201).json({
        message : "OTP sent successfully",
        data : email
    })
}

//VERIFY-OTP logic
exports.verifyOtp = async (req,res)=>{
    const{email,otp} = req.body
    if(!email || !otp){
        return res.status(404).json({
            message : "Please fill the required sections"
        })
    }

    //check if the otp obtained from that email is correct or not

    const userExist = await User.find({userEmail : email}).select("+otp")
        if(userExist.length == 0){
            return res.status(404).json({
                message : "Emailis not registered"
            })
        }
        console.log(userExist[0].otp,otp)
        if(userExist[0].otp !== +otp){ //to change string into number we can add a plus ahead like i did or we can also have done otp*1
            return res.status(404).json({
                message : "Invalid OTP"
            })
        }
        
        
        // }else {
            //dispose the otp so that it can not be used for the second time
            userExist[0].otp = undefined
        
            //dispose the otp verification for doing the same password change operation twice using same otp
            userExist[0].isOtpVerified = true

            await userExist[0].save()
            res.status(201).json({
                message : "OTP matched successfully"
            })
       
        
    
}

//resetPassword logic
exports.resetPassword = async (req,res)=>{
    //check if user enters the email,newPassword, and confirmPassword
    const {email, newPassword, confirmPassword} = req.body
    if(!email || !newPassword || !confirmPassword){
        return res.status(404).json({
            message : "Please enter email, newPassword, and confirmPassword"
        })
    }

    //check if the entered newPassword and confirmPassword are same or not
    if(!newPassword || !confirmPassword){
        return res.status(404).json({
            message : "Both password doesn't match"
        })
    }

    //yo email ko user chakinai verify garne 
    const userExist = await User.find({userEmail : email}).select("+isOtpVerified")
    if(userExist.length == 0){
        return res.status(404).json({
            message : "User email not registered"
        })
    }

    if(userExist[0].isOtpVerified !== true){
        return res.status(404).json({
            message : "You cannot perform this action"
        })
    }

    //verify bhaisakesi aba chai naya password set garne
    userExist[0].userPassword = bcrypt.hashSync(newPassword, 10)
    userExist[0].isOtpVerified = false
    await userExist[0].save()

    res.status(200).json({
        message : "Password Changed successfully"
    })

}