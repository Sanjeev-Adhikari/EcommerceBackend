const { default: axios } = require("axios")
const Order = require("../../../model/orderModel")

exports.initiateKhaltiPayment = async(req,res)=>{
    const {orderId, amount} = req.body
    if(!orderId || !amount){
        return res.status(400).json({
            message : "Please provide the required fields"
        })
    }
    const data = {
        return_url : "http://localhost:3000/api/payment/success/",
        purchase_order_id : orderId,
        amount : amount, 
        website_url : "http://localhost:3000/",
        purchase_order_name : "orderName_" + orderId
    }
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
        headers : {
            "Authorization" : "key a6ebbd154dcc4b0380a117d41049920e"
        }
    })
    console.log(response)
    let order = await Order.findById(orderId)
    order.paymentDetails.pidx = response.data.pidx
    await order.save()
    res.redirect(response.data.payment_url)
}

exports.verifyPidx = async (req,res)=>{
    
    const pidx = req.query.pidx
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
        headers : {
            "Authorization" : "key a6ebbd154dcc4b0380a117d41049920e"
        }
    })
    if(response.data.status == "Completed"){
        //modify in database
        let order = await Order.find({'paymentDetails.pidx' : pidx})
        console.log(order)
        order[0].paymentDetails.method = 'Khalti'
        order[0].paymentDetails.status = "Paid"
        await order[0].save()   

        //notify to frontend
        res.redirect("http://localhost:3000/")

    }else{
        //notify error to frontend
        res.redirect("http://localhost:3000/errorPage")
    }
}