const mongoose = require("mongoose");
const schema = mongoose.Schema

const userSchema = new schema({

    userEmail : {
        type : String,
        required : [true, "Email must be provided"]
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
        required : [true, "Password must be entered"]
    },

    role : {

        type : String,
        enum : ["customer", "admin"],
        default : "customer"
    }
    

})

const User = mongoose.model("User", userSchema)
module.exports = User