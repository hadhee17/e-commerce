const productController = require("../controller/productController");
const authController = require("../controller/authController");
const express = require("express");
const reviewRoute = require("./review");
const router = express.Router();

router.get("/get-product/:id", productController.getProductById);
router.get("/get-all-product", productController.getAllProducts);
router.get("/get-product", productController.getProductById);
router.post(
  "/create-product",
  authController.checkAuth,
  productController.createProduct
);
router.get(
  "/get-my-product",
  authController.checkAuth,
  productController.getMyProducts
);

router.use("/:productId", reviewRoute);

module.exports = router;
