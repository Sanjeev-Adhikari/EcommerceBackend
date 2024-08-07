const { getUsers, deleteUser } = require("../../controller/admin/user/userController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

//Routes
//routes start here

router.route("/users").get(isAuthenticated,restrictTo("admin"), catchAsync (getUsers))

router.route("/users/:id").delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteUser))
//routes end here


module.exports = router