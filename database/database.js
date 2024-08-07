const mongoose = require("mongoose")
const adminSeeder = require("../adminSeeder")


exports.connectDatabase = async (URI)=>{
    //connect to database using "mongoose.connect"
    await mongoose.connect(URI)
    console.log("Database is connected successfully")

//admin seeding function
adminSeeder()


}