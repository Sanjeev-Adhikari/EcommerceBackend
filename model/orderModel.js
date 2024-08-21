const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref  : "User"
    },
    items : [{
        quantity : {
            type : Number,
            required : true
        },
        product : {
            type : Schema.Types.ObjectId,
            ref : "Product",
            required : true
        }
    }],
    totalAmount : {
        type : Number,
        required : true
    },
    shippingAddress : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        enum : ['pending', 'delivered', 'cancelled', 'ontheway', 'underpreparation'],
        default : 'pending'
    },
    paymentDetails : {
        pidx : {
            type : String
        },
        method : {
            type : String,
            enum : ["CashOnDelivery", "khalti"]
        },
        status : {
            type : String,
            enum : ["paid" , "unpaid", "failed" , "pending"],
            default : "pending"   
        }
    }

},{
    timestamps : true
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order