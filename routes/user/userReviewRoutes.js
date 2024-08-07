const { getMyReviews, deleteReview, createReview } = require("../../controller/user/review/reviewController")

const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")

const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()


//Routes
//Routes start
//Route for creating reviews
router.route("/")
.get(isAuthenticated, catchAsync(getMyReviews))
//route for viewing (getting) and deleteing reviews
router.route("/:id")
.delete(isAuthenticated, catchAsync(deleteReview))
.post(isAuthenticated, restrictTo("user") ,catchAsync ( createReview))



//Routes end

module.exports = router