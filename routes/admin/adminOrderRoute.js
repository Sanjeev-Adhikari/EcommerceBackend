const { getAllOrders, getSingleOrder, updateOrderStatus, deletOrder, updatePaymentStatus } = require("../../controller/admin/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//Routes
//Routes start
router.route("/orders")
.get(isAuthenticated, restrictTo("admin"), catchAsync(getAllOrders))

router.route("/orders/paymentstatus/:id")
.patch(isAuthenticated, restrictTo("admin"), catchAsync(updatePaymentStatus))

router.route("/orders/:id")
.get(isAuthenticated, restrictTo("admin"), catchAsync(getSingleOrder))
.patch(isAuthenticated, restrictTo("admin"), catchAsync(updateOrderStatus))
.delete(isAuthenticated, restrictTo("admin"), catchAsync(deletOrder))


//Routes End

module.exports  = router