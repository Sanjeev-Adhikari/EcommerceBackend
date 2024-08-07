const { getMyprofile, deleteMyProfile, updateMyProfile, updateMyPassword } = require("../../controller/user/profile/profileController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//Routes
//Routes start

router.route("/")
.get(isAuthenticated, catchAsync(getMyprofile))
.delete(isAuthenticated, catchAsync(deleteMyProfile))
.patch(isAuthenticated,catchAsync (updateMyProfile))


router.route("/changePassword")
.patch(isAuthenticated,catchAsync(updateMyPassword))

//Routes End

module.exports = router