const express = require("express");
const { connectDatabase } = require("./database/database");

const app = express();

const {Server} = require("socket.io")

const cors = require("cors")
//requiring route
const authRoute = require("./routes/auth/authRoutes")
const productRoute = require("./routes/admin/productRoute")
const adminUserRoute = require("./routes/admin/adminUserRoutes")
const userReviewRoute = require("./routes/user/userReviewRoutes")
const profileRoute  = require("./routes/user/profileRoute")
const cartRoute = require("./routes/user/cartRoute")
const orderRoute = require("./routes/user/orderRoute")
const adminOrderRoute = require("./routes/admin/adminOrderRoute")
const paymentRoute = require("./routes/user/paymentRoute");
const User = require("./model/userModel");
//routes end

app.use(cors({
    origin : "*"
}))
//TELL NODE to use dotenv
require("dotenv").config()

//Handle undefined while making apis
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//teling node js to show the files inside upload folder

app.use(express.static("uploads"))

//Check if the server is up and running
app.get("/", (req,res)=>{
    res.status(201).json({
        message : "Server is running"
    })
})

//Connect to Database
connectDatabase(process.env.MONGO_URI)

//API CREATION HERE => Calling Routes for apis here
//Keeping all authentication apis in routes and calling it through authroute
app.use("/api/auth",authRoute)
//keeping all product apis in routes and calling it through productRoute
app.use("/api/products",productRoute)
app.use("/api/admin",adminUserRoute)
app.use("/api/reviews",userReviewRoute)
app.use("/api/profile",profileRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/admin", adminOrderRoute)
app.use("/api/payment", paymentRoute)


//API ENDS

//Make server to listen run on a port so that it can run
const PORT = process.env.PORT
const server = app.listen(PORT, ()=>{
    console.log("Server is Up and Running at 3000")
}) 
const io = new Server(server)

io.on("connection", (socket)=>{
    socket.on("register", async (data)=>{
         const {username,phoneNumber,email,password} = data
        // await User.create ({
        //     userEmail : email,
        //     userName : username,
        //     userPhoneNumber : phoneNumber,
        //     userPassword : password
        // })
      //io.emit("response"), {message : "User registered"} 
      io.to(socket.id).emit("response", {message : "User registered successfully"}) 
    })

    console.log("A user connected")

    socket.on('disconnect',()=>{
        console.log("A user disconnected")
    })
})
//io lai ettikai export garna mildaina modules.exports = io garera so hamle euta function banako ani tesbhitra chai io lai return garera ani tyo function lai export gareko aba jata yo function invoke garinxa tya io import hunxa 
function getSocketIo(){
    return io
}

module.exports.getSocketIo = getSocketIo