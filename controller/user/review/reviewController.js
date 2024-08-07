
const Product = require("../../../model/productModel")
const Review = require("../../../model/reviewModel")


exports.createReview = async (req,res)=>{

    const userId = req.user.id
    const productId = req.params.id
    const {rating,message} = req.body
    if(!rating || !message || !productId){
        return res.status(400).json({
            message: "please provide the require fields"
        })
    }
    //check if that productwith that id exists or not
    const productExists = await Product.findById(productId)
    if(!productExists){
        return res.status(404).json({
            message : "Product with that id does not exists"
        })
    }
    //insert them into review
    await Review.create({
            userId,
            productId,
            rating,
            message

    })
    res.status(201).json({
        message : "Review added successfully"
    })
}

// exports.getProductReview = async (req,res)=>{
//     const productId = req.params.id
//     if(!productId){
//         return res.status(400).json({
//             message : "Please provide product id"
//         })
//     }
//     //same thing as up=>checking if the product with that id exists or not
//     const productExists = await Product.findById(productId)
//     if(!productExists){
//         return res.status(404).json({
//             message : "Product with that id does not exist"
//         })
//     }
//     //getting the reviews that are done on the given product id
//     const reviews = await Review.find({productId }).populate("userId").populate("productId")
//     res.status(200).json({
//         message : "Reviews fetched successfully",
//         data : reviews
//     })
// }

exports.getMyReviews = async (req,res)=>{
    const userId  = req.user.id
    const reviews = await Review.find({userId})
    if(reviews.length == 0){
        res.status(404).json({
            message : "you haven't given any review yet",
            data : []
        })
    } else{
        res.status(201).json({
            message : "Review fetched successfully",
            data :  reviews
        })
    }
}

//delete review logic(API)
exports.deleteReview = async (req,res)=>{
    const reviewId = req.params.id
    //check if that user created this review
    const userId = req.user.id
    
     //check if review with that id exists
    if(!reviewId){
        return res.status(400).json({
            message : "Please provide reviewId"
        })
    }
    //check if that user created this review
    const review = Review.findById(reviewId)
    const ownerIdOfReview = review.userId
    if(ownerIdOfReview !== userId){
        return res.status(400).json({
            message : "You don't have permission to do this"
        })
    }
   
    const reviewExists = await Review.findById(reviewId)
    if(!reviewExists){
        return res.status(400).json({
            message : "Review with this id does not exists"
        })
    }
    //delete the review
    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({
        message : "Review deleted successfully"
    })



}


// exports.addProductReview = async (req,res)=>{
//     const productId = req.params.id
//     const {rating, message} = req.body
//     const userId = req.user.id
//     const review = {
//         userId,
//         rating,
//         message,
//     }
//     const product = await Product.findById(productId)
//     product.reviews.push(review)
//     await product.save()
//     res.json({
//         message : "Review done"
//     })
// }