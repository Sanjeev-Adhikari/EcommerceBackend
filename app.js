const express = require("express");
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel");
const app = express();

//requiring route
const authRoute = require("./routes/authRoutes")

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
//Keeping all api in routes and calling it through authroute
app.use("",authRoute)




//Make server to listen run on a port so that it can run
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log("Server is Up and Running at 3000")
} ) 
