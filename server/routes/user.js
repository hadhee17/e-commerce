const express = require("express");
const authController = require("../controller/authController");
const route = express.Router();

route.post("/signup", authController.signup);
route.post("/login", authController.login);
route.post("/check-user", authController.checkAuth);
route.get("/profile", authController.checkAuth, authController.profile);
route.post("/logout", authController.logout);
route.get("/:id", authController.getUserById);

module.exports = route;
