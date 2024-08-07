const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "A user must belong to a user"]
    },
    rating : {
        type : Number,
        required : true,
        default : 3
    },
    message : {
        type : String,
        required : true
    }
})

const NextWayReview = mongoose.model("NextWayReview", reviewSchema)
module.exports = {
    NextWayReview,
    reviewSchema
}