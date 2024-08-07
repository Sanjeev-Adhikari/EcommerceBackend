const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")

//add to cart
exports.addToCart = async(req,res)=>{
    const userId = req.user.id
    const {productId} = req.params
    //check if productId is given or not
    if(!productId){
        return res.status(400).json({
            message : "Please provide productId"
        })
    } 
    //check if the product with that productId exists or not
    const productExists = await Product.findById(productId)
    if(!productExists){
        return res.status(404).json({
            message : "No product with that ProductId"
        })
    }
    //find the user with userId in User Model
    const user = await User.findById(userId)
    //push the product id into the cart
    user.cart.push(productId)
    //save the changes into the database
    await user.save()
    //show response
    res.status(200).json({
        message : "Product added to cart"
    })
}   

//get the cart items
exports.getMyCartItems  = async(req,res)=>{
    const userId = req.user.id
    const userData = await User.findById(userId).populate({
        path : "cart",
        select : "-productStatus" 
        
    })
    
    res.status(200).json({
        message : "Cart Items are fetched successfully",
        data : userData.cart
    })
}
//delete the cart items
exports.deleteItemFromCart = async(req,res)=>{
    const {productId} = req.params
    const userId = req.user.id
    //check if that product exists or not
    const product = await Product.findById(productId)
    if(!product){
        return res.status(404).json({
            message : "No product found with that id"
        })
    }
    //get user cart
  
    const user = await User.findById(userId)
    user.cart = user.cart.filter((pId)=>pId != productId) 
    //manam hami sanga euta array cha jasma product id [1, 2, 3] cha aba maile ==> 2 bhanne product chai cart bata hatauna man lagyo 
    // filter==> le k garxa bhnda kosko id chai 2 chaina ==>Matlab ki hamle dlt garna khojeko id (2) yani pId chai overall productId sanga match garne or 2(pId) bahek kk productid cha herxa ani return garxa [1 , 3]yani bacheko productId 
    //==> ani aba eslai lagera user.cart ma haleko ani next chai ===>> user.save()==> garda save hunxa bacheko [1 , 3 ] ani [2( hamle dlt garna khojeko id yani pId) bhnne udeko hunxa filter huda]
    await user.save()
    res.status(200).json({
        mesage : "Item removed from the cart"
    })
}  

