const Order = require("../../../model/orderModel")

exports.createOrder = async(req,res)=>{
    const userId = req.user.id
    const {shippingAddress,items,totalAmount,paymentDetails} = req.body
    //check if all the fields are fields or not
    if(!shippingAddress || !items.length > 0 || !totalAmount || !paymentDetails) {
        return res.status(400).json({
            message : "Please fill the required fields"
        })
    }
    //create orders==>>Insert into order table
    await Order.create({
        user : userId,
        shippingAddress,
        totalAmount,
        items,
        paymentDetails
    })
    res.status(200).json({
        message : "order created successfully"
    })
}

exports.getMyOrders = async(req,res)=>{
    const userId = req.user.id
    const orders = await Order.find({user : userId}).populate({
        path : "items.product",
        model : "Product",
        select : "-productStockQty -createdAt -updatedAt -reviews -__v"
    })
    //populate({                  ==>>
    //     path : "items.product",
    //     model : "Product"
    // })

    if(orders.length == 0 ){
        return res.status(404).json({
            message : "No any orders yet",
            data : []
        })
    }
    res.status(200).json({
        message : "Orders Fetched successfully",
        data : orders
    })

}

exports.updateMyOrder = async(req,res)=>{
    const userId = req.user.id
    const {id} = req.params
    const {shippingAddress, items} = req.body

    if(!shippingAddress || items.length == 0)
    {
        return res.status(400).json({
            message : "Please provide shippingAddhress and items to update"
        })
    }
//get order of above id
const existingOrder = await Order.findById(id)
if(!existingOrder){
    return res.status(400).json({
        message : "No order with that id"
    })
}
//check if the user trying to update the order is the user who created the order
if(existingOrder.user !==userId){
    return res.status(404).json({
        message : "You don't have permission to update this order"
    })
}

if(existingOrder.orderStatus == "ontheway") {
    return res.status(400).json({
        message : "You can not update order when it is on the way"
    })
}
const updatedOrder = await Order.findByIdAndUpdate(id,{shippingAddress,items},{new : true})
res.status(200).json({
    message : "Order updated successfully",
    data : updatedOrder
})

}

exports.deleteOrder = async(req,res)=>{
    const {userId} = req.user.id
    const {id} = req.params

    //check if the order exists or not
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id exists"
        })

    }
    if(order.user !== userId){
        return res.status(400).json({
            message : "You don't have permission to delete this order"
        })
    }
    await Order.findByIdAndDelete(id)
    res.json(200).json({
        message : "Order deleted successfully",
        data : null
    })
}

exports.cancelOrder = async(req,res)=>{
    const {id} = req.body.id
    const userId = req.user.id
    
    //check if the order exists or not
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id exists"
        })
    }
    //check if the user trying to change order status is the user who ordered the thing
    if(order.user !== userId){
        return res.status(400).json({
            message : "You don't have permission to do this"
        })
    }
    //check if the order status is pending or not because user cannot update an order which is not pending
    if(order.orderStatus !== "pending"){
        return res.status(404).json({
            message : "You can not cancel this order as it is not pending"
        })
    }
    //cancel the order
    const updatedOrder = await Order.findByIdAndUpdate(id,{
        orderstatus : "cancelled"
    },{new:true})
    res.status(200).json({
        message : "order cancelled successfully",
        data : updatedOrder
    })
}



