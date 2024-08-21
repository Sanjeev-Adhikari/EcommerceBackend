const Order = require('../../../model/orderModel')
const User = require('../../../model/userModel')
const Product = require('../../../model/productModel')

class DataService{
    async getDatas(req,res){
        const orders = (await Order.find()).length
        const users = (await User.find()).length
        const products = (await Product.find()).length
        res.status(200).json({
            message : "Data Fetched Successfully",
            data : {
                orders,
                users,
                products
            }
        })
    }
}

const DataServices = new DataService()
module.exports = DataServices