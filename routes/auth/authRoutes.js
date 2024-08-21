
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require("../../controller/auth/authController")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//Routes start

//route for Register API
router.route("/register").post( catchAsync(registerUser))

//route for login API
router.route("/login").post(catchAsync(loginUser))

//route for forgot password API
router.route("/forgotpassword").post(catchAsync(forgotPassword))

//route for verify otp API
router.route("/verifyotp").post(catchAsync(verifyOtp))

//route for resetPassword API
router.route("/resetpassword").post(catchAsync(resetPassword))

//Routes end



module.exports = router