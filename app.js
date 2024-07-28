const express = require("express");
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel");
const app = express();

//requiring bcrypt for hasing the password
const bcrypt = require("bcryptjs")

//requiring jsonwebtoken for making tokens for users
const jwt = require("jsonwebtoken")



//TELL NODE to use dotenv
require("dotenv").config()

//Handle undefined while making apis

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Check if the server is up and running
app.get("/", (req,res)=>{
    res.status(201).json({
        message : "Server is running"
    })
})

//Connect to Database
connectDatabase(process.env.MONGO_URI)

//API CREATION HERE

//REGISTER-API
app.post("/register", async (req,res)=>{

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
    await User.create ({
        userName : userName,
        userPhoneNumber : phoneNumber,
        userEmail : email,
        userPassword : bcrypt.hashSync(password, 10)
    })
    res.status(201).json ({
        message : "User created successfully"
    })
   
})

//LOGIN-API
app.post("/login", async (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(404).json({
            message: "Please provide email and password to login"
        })
    }
    
    //chech if the email exists or not
    const userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
        return res.status(404).json({
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
            token
        })
    }else{
        res.status(404).json({
            message : "Invalid email or password"
        })
    }
     
})









//Make server to listen run on a port so that it can run
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log("Server is Up and Running at 3000")
} ) 
