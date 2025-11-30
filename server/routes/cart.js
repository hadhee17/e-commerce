const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");

// All routes require login
router.use(authController.checkAuth);

router.post("/add", cartController.addToCart);
router.get("/getCart", cartController.getUserCart);
router.delete("/:id", cartController.removeCartItem);

module.exports = router;
