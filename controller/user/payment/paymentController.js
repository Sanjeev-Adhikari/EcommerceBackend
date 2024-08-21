const { default: axios } = require("axios")
const Order = require("../../../model/orderModel")
const User = require("../../../model/userModel")

exports.initiateKhaltiPayment = async(req,res)=>{
    const {orderId, amount} = req.body
    if(!orderId || !amount){
        return res.status(400).json({
            message : "Please provide the required fields"
        })
    }
    let order = await Order.findById(orderId)
    if(!order){
        return res.status(404).json({
            message : "Order not found with that id"
        })
    }
    //check if the comming amount is the amount of order

    if(order.totalAmount !== amount){
        return res.status(400).json({
            message : "Amount must be equal to totalAmount" 
        })
    }
    const data = {
        return_url : "http://localhost:5173/success/",
        purchase_order_id : orderId,
        amount : amount * 100,
        website_url : "http://localhost:3000/",
        purchase_order_name : "orderName_" + orderId
    }

    
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
        headers : {
            "Authorization" : "key a6ebbd154dcc4b0380a117d41049920e"
        }
    })
    
    order.paymentDetails.pidx = response.data.pidx

    await order.save()
    res.status(200).json({
        message : "Payment completed successfully",
        paymentUrl : response.data.payment_url
    })

}

exports.verifyPidx = async (req,res)=>{
    const userId = req.user.id
    const pidx = req.body.pidx
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
        headers : {
            "Authorization" : "key a6ebbd154dcc4b0380a117d41049920e"
        }
    })
    if(response.data.status == "Completed"){
        //modify in database
        let order = await Order.find({'paymentDetails.pidx' : pidx})
        
        order[0].paymentDetails.method = 'khalti'
        order[0].paymentDetails.status = "paid"
        await order[0].save()   

        //empty cart item after checkout
        const user = await User.findById(userId)
        user.cart = []
        await user.save()
        res.status(200).json({
            message : "Payment  Verification successful"
          
        })

    

    }
    //else{
    //     //notify error to frontend
    //     res.redirect("http://localhost:3000/errorPage")
    // }
}
