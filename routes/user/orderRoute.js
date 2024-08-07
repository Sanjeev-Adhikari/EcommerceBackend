const { getMyOrders, createOrder, updateMyOrder, deleteOrder, cancelOrder } = require("../../controller/user/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const { deleteMany } = require("../../model/userModel")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//routes
//routes start

router.route("/")
.get(isAuthenticated,catchAsync(getMyOrders))
.post(isAuthenticated, catchAsync(createOrder))


router.route("/cancel").patch(isAuthenticated, catchAsync(cancelOrder))

router.route("/:id")
.patch(isAuthenticated, catchAsync (updateMyOrder))
.delete(isAuthenticated, catchAsync(deleteOrder))
//routes end



module.exports = router