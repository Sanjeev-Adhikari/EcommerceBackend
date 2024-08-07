const mongoose = require("mongoose")
// const { reviewSchema } = require("./nextReviewModel")
const Schema = mongoose.Schema

const productSchema = new Schema({
    productName : {
        type : String,
        required : [true, "Product name must be provided"]
    },

    productDescription : {
        type : String,
        required : [true, "Product description must be provided"]
    },

    productPrice : {
        type : Number,
        required : [true , "Product proce must be provided"]
    },

    productStatus : {
        type : String,
        required : [true, "Product status must be provided"]
    },

    productStockQty : {
        type : Number,
        required : [true, "Product quantity must be provided"]
    },
    productImage : {
        type : String
    },
    // reviews : [reviewSchema]
},{
    timestamps : true
})
//make the product model=>keep the above made productSchema into Produt model
const Product =  mongoose.model("Product", productSchema)
module.exports = Product