const { initiateKhaltiPayment, verifyPidx } = require("../../controller/user/payment/paymentController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//routes
//routes start

router.route("/")
.post(isAuthenticated, (initiateKhaltiPayment))

router.route("/success")
.get( catchAsync(verifyPidx))
//routes end

module.exports = router