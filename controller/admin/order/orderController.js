const Order = require("../../../model/orderModel")

exports.getAllOrders = async(req,res)=>{
    
    const orders = await Order.find().populate({
        path : "items.product",
        model : "Product"
    })
    res.status(200).json({
        message : "Orders Fetched successfully",
        orders
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

    if(!orderStatus || !["pending" , "delivered" , "cancelled" , "ontheway" , "preparation"].includes(orderStatus.toLowerCase()) ){
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
        orderstatus : "cancelled"
    },{new:true})

    res.status(200).json({
        message : "order cancelled successfully",
        data : updatedOrder
    })
}

exports.deletOrder = async(req,res)=>{
    const {id} = req.params
    const order = await Ordeer.findById(id)
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