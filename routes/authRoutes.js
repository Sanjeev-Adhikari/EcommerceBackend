const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require("../controller/auth/authController")

const router = require("express").Router()

//Routes start

//route for Register API
router.route("/register").post(registerUser)

//route for login API
router.route("/login").post(loginUser)

//route for forgot password
router.route("/forgotPassword").post(forgotPassword)

//route for verify otp
router.route("/verifyOtp").post(verifyOtp)

//route for resetPassword
router.route("/resetPassword").post(resetPassword)

//Routes end



module.exports = router