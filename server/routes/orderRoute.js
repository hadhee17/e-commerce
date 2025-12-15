const express = require("express");
const authController = require("../controller/authController");
const orderController = require("../controller/orderController");

const router = express.Router();

router.use(authController.checkAuth); // Protect all booking routes

router
  .route("/create")
  .post(authController.checkAuth, orderController.createOrder);
router.route("/my-orders").get(orderController.getMyOrders);
router.route("/:id").delete(orderController.deleteOrder);

module.exports = router;
