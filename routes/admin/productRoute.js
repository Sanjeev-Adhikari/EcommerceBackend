const { createProduct, deleteProduct, editProduct, updateProductStatus, updateProductStockAndPrice, getOrdersOfAProduct } = require("../../controller/admin/Product/productController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")

const router = require("express").Router()

const {multer, storage} = require("../../middleware/multerConfig")
const catchAsync = require("../../services/catchAsync")
const { getProducts, getProduct } = require("../../controller/global/globalController")
const upload = multer({storage: storage})


//routes start

//route for productcreation API + product get API
router.route("/")
.post(isAuthenticated, restrictTo("admin"), upload.single("productImage"), catchAsync (createProduct))
.get(catchAsync (getProducts))

router.route("/productorders/:id")
.get(isAuthenticated, restrictTo("admin"), (getOrdersOfAProduct))

router.route("/status/:id")
.patch(isAuthenticated, restrictTo("admin") ,catchAsync(updateProductStatus))

router.route("/stockprice/:id")
.patch(isAuthenticated, restrictTo("admin"), catchAsync(updateProductStockAndPrice))

router.route("/:id")
.get( catchAsync (getProduct))
.delete(isAuthenticated, restrictTo("admin"), catchAsync (deleteProduct))
.patch(isAuthenticated, restrictTo("admin"), upload.single("productImage"), catchAsync (editProduct))
//routes end 
 module.exports = router