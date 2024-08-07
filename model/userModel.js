const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({

    userEmail : {
        type : String,
        required : [true, "Email must be provided"],
        unique : true,
        lowercase : true
    },

    userName : {
        type : String,
        required : [true, "UserName must be provided"]

    },

    userPhoneNumber : {
        type : Number,
        required : [true, "Phone number must be provided"]
    },

    userPassword : {
        type : String,
        required : [true, "Password must be entered"],
        //select : false
    },

    role : {

        type : String,
        enum : ["customer", "admin"],
        default : "customer"
       
    },
    
    otp : {
        type : Number,
        select : false
    },

    isOtpVerified : { 
        type :  Boolean,
        default : false,
        select : false
    },
    cart : [{
        type : Schema.Types.ObjectId, 
        ref : "Product"
    }]

})

const User = mongoose.model("User", userSchema)
module.exports = User