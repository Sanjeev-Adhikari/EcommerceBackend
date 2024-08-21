const Product = require("../../../model/productModel")
const Order = require("../../../model/orderModel")

//requiring file system package
const fs = require("fs")
//Logic for creating product goes here
exports.createProduct = async (req,res)=>{


const file = req.file
let filePath
if(!file){
    filePath = "https://plus.unsplash.com/premium_photo-1661769750859-64b5f1539aa8?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}else {
    filePath = req.file.filename
}

const {productName, productDescription, productPrice, productStatus, productStockQty} = req.body
//check if admin submits all the required fild or not
//here we can check each field and give respective response but i have done all at once
if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty){
    return res.status(404).json({
        message : "Plese Enter the required fields"
    })
}

//insert data into the product collection table
const createdProduct = await Product.create({
     productName : productName,
     productDescription : productDescription,
     productPrice : productPrice,
     productStatus : productStatus,
     productStockQty : productStockQty,
     productImage :  process.env.BACKEND_URL + filePath
})
res.status(201).json({
    message : "Product Created Successfully",
    data : createdProduct
})
    
}




//logic for deleting the product with unique id
exports.deleteProduct = async(req,res)=>{
 const {id} = req.params
 if(!id){
    return res.status(400).json({
        message : "Please provide id"
    })
 }
 const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id",
        
        })
    }
    
    //here, the old productImage is found and if found it is deleted iinordor to upload a new one,
    // =>Notice this, that we are replacing the BACKEND_URL FROM THE FILE NAME TO GET THE ACTUAL FILE NAME
    const oldProductImage = oldData.productImage //http://localhost:3000/1722655014932-pic.PNG
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) //this has now cut the backend_url and the original filename is fetched

    //Remove file from the uploads folder
    fs.unlink("./uploads/" + finalFilePathAfterCut,(err)=>{
        if(err){
            console.log("Error deleting file",err)
        }else{
            console.log("File deleted successfully")
        }
    })

  await Product.findByIdAndDelete(id)
    res.status(201).json({
        message : "Product deleted successfully"
      
    })
}

//Logic for updating the product with unique id
exports.editProduct = async(req,res)=>{

    //EXAMPLE FOR DELEATING A FILE FROM uploads FOLDER USING fs=>FILE SYSTEM
    // fs.unlink("./uploads/EPRO104 Assessment 3_ Children's Literature Analysis-English.txt",(err)=>{
    //     if(err){
    //         console.log("Error occured",err)
    //     }else{
    //         console.log("file deleated successfully")
    //     }
    // })
    // return

    const {id} =req.params
    const {productName, productDescription, productPrice, productStatus, productStockQty} = req.body
    if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty || !id){
        return res.status(404).json({
            message : "Plese Enter the required fields"
        })
    }
    const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }
    
    //here, the old productImage is found and if found it is deleted iinordor to upload a new one,
    // =>Notice this, that we are replacing the BACKEND_URL FROM THE FILE NAME TO GET THE ACTUAL FILE NAME
    const oldProductImage = oldData.productImage //http://localhost:3000/1722655014932-pic.PNG
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) //this has now cut the backend_url and the original filename is fetched
    if(req.file && req.file.filename){
        //Remove file from the uploads folder
        fs.unlink("./uploads/" + finalFilePathAfterCut,(err)=>{
            if(err){
                console.log("Error deleting file",err)
            }else{
                console.log("File deleted successfully")
            }
        })
    }

    //upload new ProductImage file after deleting the old one
    const datas = await Product.findByIdAndUpdate(id,{
     productName,
     productDescription,
     productPrice,
     productStatus,
     productStockQty,
     productImage : req.file && req.file.filename ?  process.env.BACKEND_URL + req.file.filename : oldProductImage
    },{
        new: true,
        
    })
    res.status(200).json({
        message : "Product Updated Successfully",
        data : datas
    })
}

exports.updateProductStatus = async (req,res)=>{
    const {id} = req.params
    const {productStatus} = req.body

    if(!productStatus || !['available','unavailable'].includes(productStatus.toLowerCase())){
        return res.status(400).json({
            message : "productStatus is invalid or should be provided"
        })
    }

    const product = await Product.findById(id)
    if(!product){
        return res.status(404).json({
            message : "No poduct found with that id "
        }) 
    }

    const updatedProductStatus = await Product.findByIdAndUpdate(id,{
        productStatus
    },{new : true})

    res.status(200).json({
        message : "Product Status updated sucessfully",
        data : updatedProductStatus
    })



}

exports.updateProductStockAndPrice = async(req,res)=>{
    const {id} = req.params
    const {productStockQty,productPrice} = req.body

    if(!productStockQty && !productPrice){
        return res.status(400).json({
            message : "Please provide productStockQty or productPrice"
        })
    }

    const product = await Product.findById(id)
    if(!product){
        return res.status(404).json({
            message : "Product with that id not found"
        })
    }

    const updatedStockAndPrice = await Product.findByIdAndUpdate(id,{
        productStockQty : productStockQty? productStockQty : product.productStockQty,
        productPrice : productPrice? productPrice : product.productPrice
    })

    res.status(200).json({
        message : "Updated Successully",
        data : updatedStockAndPrice
    })
}

exports.getOrdersOfAProduct = async(req,res)=>{
    const {id: productId} = req.params

    const product = await Product.findById(productId)
    if(!product){
        return res.status(404).json({
            message : "No product found with that id"
        })
    }
    const productOrders = await Order.find({'items.product' : productId}).populate('user')

    res.status(200).json({
        message : "Product orders fetched successfully",
        data : productOrders
    })
}
