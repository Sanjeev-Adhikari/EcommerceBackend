const express = require("express");
const { connectDatabase } = require("./database/database");
const jwt = require("jsonwebtoken")
const {promisify} = require("util")

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
const dataServiceRoute = require("./routes/admin/dataServiceRoute")
//routes end


const User = require("./model/userModel");


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
app.use("/api/admin", dataServiceRoute)
app.use("/api/payment", paymentRoute)



//API ENDS

//Make server to listen run on a port so that it can run
const PORT = process.env.PORT
const server = app.listen(PORT, ()=>{
    console.log(`Server is Up and Running at Port : ${PORT}`)
}) 
const io = new Server(server,{
    cors : "https://admin-one-rouge.vercel.app/"
})
    
let onlineUsers = []
const addToOnlineUsers = (socketId, userId, role)=>{
   onlineUsers =  onlineUsers.filter((user)=>user.userId !== userId)
    onlineUsers.push({socketId,userId,role})
    console.log(onlineUsers)
}
  
io.on("connection", async(socket)=>{
        //take the token and validate it
        const {token} = socket.handshake.auth
        if(token){
            //validate token
            const decoded = await promisify(jwt.verify)(token,process.env.SECRET_KEY)
            const doesUserExists = await User.findOne({_id : decoded.id})
            if(doesUserExists){
                addToOnlineUsers(socket.id,doesUserExists.id, doesUserExists.role)
            }

        }

        socket.on('updateOrderStatus',({status,orderId,userId})=>{
          const findUser =  onlineUsers.find((user)=> user.userId == userId)
         io.to(findUser.socketId).emit("statusUpdated",{status,orderId})
        })
    })


