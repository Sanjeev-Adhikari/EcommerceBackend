const mongoose = require("mongoose")

exports.connectDatabase = async (URI)=>{
    //connect to database using "mongoose.connect"
    await mongoose.connect(URI)
    console.log("Database is connected successfully")
}