const Order = require("../../../model/orderModel")
const Product = require("../../../model/productModel")

exports.getAllOrders = async(req,res)=>{
    
    const orders = await Order.find().populate({
        path : "items.product",
        model : "Product"
    }).populate('user')
    res.status(200).json({
        message : "Orders Fetched successfully",
        data : orders
    })

}

exports.getSingleOrder = async(req,res)=>{
    const {id} = req.params
    
    //check if order exists or not
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "Order with that id does not exists"
        })
    }
    res.status(200).json({
        message : "Order fetched successfully",
        data : order
    })
}

exports.updateOrderStatus = async (req,res)=>{
    const {id} = req.params
    const {orderStatus} = req.body

    if(!orderStatus || !["pending" , "delivered" , "cancelled" , "ontheway" , "underpreparation"].includes(orderStatus.toLowerCase()) ){
        return res.status(400).json({
            message : "Order status is invalid or should be provided"
        })
    }
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "Order with that id not found"
        })
    }
    const updatedOrder = await Order.findByIdAndUpdate(id,{
        orderStatus 
    },{new:true}).populate({
        path : "items.product",
        model : "Product"
    }).populate('user')

    let necessaryData //block level ma declare gareko 
    if(orderStatus === 'delivered'){
       necessaryData =  updatedOrder.items.map((item)=>{

            return {
                quantity : item.quantity,
                productId : item.product._id,
                productStockQty : item.product.productStockQty

            }
        })
        
        for(var i = 0 ; i < necessaryData.length ; i++){
            await Product.findByIdAndUpdate(necessaryData[i].productId, {
                productStockQty : necessaryData[i].productStockQty - necessaryData[i].quantity
            })
            
        }
    }

    res.status(200).json({
        message : "order updated successfully",
        data : updatedOrder
      
    })
}

exports.updatePaymentStatus = async (req,res)=>{
    const {id} = req.params
    const {paymentStatus} = req.body

    if(!paymentStatus || !["paid" , "unpaid", "failed" , "pending"].includes(paymentStatus.toLowerCase()) ){
        return res.status(400).json({
            message : "paymentStatus is invalid or should be provided"
        })
    }
    const order = await Order.findById(id)
    if(!order){
        return res.status(404).json({
            message : "order with that id not found"
        })
    }
    const updatedPayment = await Order.findByIdAndUpdate(id,{
        'paymentDetails.status' : paymentStatus 

    },{new:true}).populate({
        path : "items.product",
        model : "Product"
    }).populate('user')

    res.status(200).json({
        message : "Payment status updated successfully",
        data : updatedPayment
    })
}
exports.deletOrder = async(req,res)=>{
    const {id} = req.params
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id exists"
        })

    }
    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message :  "Order deleted successfully",
        data : null
    })
}