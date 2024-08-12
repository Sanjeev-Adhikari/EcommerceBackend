const { addToCart, getMyCartItems, deleteItemFromCart, updateCartItems } = require("../../controller/user/cart/cartController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//routes
//routes start

router.route("/")
.get(isAuthenticated, (getMyCartItems))

router.route("/:productId")
.post(isAuthenticated, (addToCart))
.delete(isAuthenticated, catchAsync (deleteItemFromCart))
.patch(isAuthenticated, (updateCartItems))


//routes end


module.exports = router