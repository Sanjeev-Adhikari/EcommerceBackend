const { addToCart, getMyCartItems, deleteItemFromCart } = require("../../controller/user/cart/cartController")
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


//routes end


module.exports = router