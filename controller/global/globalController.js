const Product = require("../../model/productModel")

//logic for getting/fetching the products goes here
exports.getProducts = async (req,res)=>{
    // const products = await Product.find().populate({
    //     path : "reviews",
    //     populate : {
    //         path : "userId",
    //         select : "userName userEmail"
    //     }
        //suruma chai product bhanne model ko reviews bhanne field lai pakadeko ani tesko chai userId field lai pakadeko
        //yo code le bhnxa ki aba Product find garda populate gar => matlab add gar or join gar join garera k garney ta bhnda product bhitra aba review chai ko user le gareko dekhaune hamro aim ho
        //aba esma chai suruma hamle populate({ path : "reviews", yo garera reviews bhitra chirko ani aba chai populate : {path : "userId"} garera reviews bhitra userId lai populate gar bhneko}) 
        //yeslai nai bhnxan nested populate garnu. finally, select ma userName ra userEmail diyera aba populate garda malai chai user ko name ra email matra dey jasle ki product ko review chai kun user le gareko ra tesko email k ho tha hunxa//populate({
        // path : "reviews",
        // populate : {
        //     path : "userId",
        //     select : "userName userEmail"
        // }
    // })
    const products = await Product.find()
    if(Product.length == 0){
        res.status(400).json({
            message : "Product not found",
            data : [],
        })
    }else { 
        res.status(201).json({
            message : "Products fetched successfully",
            data : products
        })
    }
}

//logic for getting/fetching the product with unique id
exports.getProduct = async (req,res)=>{
    const {id} = req.params
    if(!id){
        return res.status(404).json({
            message : "Please provide product-id"
        })
    }
    const product = await Product.find({_id : id})
    const productRevies = await Review.find({productId : id }).populate("userId").populate("productId")
    if(product.length == 0){
        res.status(400).json({
            message : "No product with this id",
            data : {
                data : [],
                data2 : []
            }
        })
    }else{
        res.status(201).json({
            message : "Product found successfully",
            data : {
                product,
                productRevies
            }
        })
    }

}