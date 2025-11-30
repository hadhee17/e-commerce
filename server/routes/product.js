const productController = require("../controller/productController");
const express = require("express");
const reviewRoute = require("./review");
const router = express.Router();

router.get("/get-product/:id", productController.getProductById);
router.get("/get-all-product", productController.getAllProducts);
router.get("/get-product", productController.getProductById);
router.post("/create-product", productController.createProduct);

router.use("/:productId", reviewRoute);

module.exports = router;
