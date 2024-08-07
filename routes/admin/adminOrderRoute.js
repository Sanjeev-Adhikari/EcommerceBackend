const { getAllOrders, getSingleOrder, updateOrderStatus, deletOrder } = require("../../controller/admin/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//Routes
//Routes start
router.route("/")
.get(isAuthenticated, restrictTo("admin"), catchAsync(getAllOrders))

router.route("/:id")
.get(isAuthenticated, restrictTo("admin"), catchAsync(getSingleOrder))
.patch(isAuthenticated, restrictTo("admin"), catchAsync(updateOrderStatus))
.delete(isAuthenticated, restrictTo("admin"), catchAsync(deletOrder))
//Routes End

module.exports  = router