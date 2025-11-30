const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post(
  "/create-review",
  authController.checkAuth,
  authController.restrictTo("user"),
  reviewController.createReview
);

router.get("/get-review/:id", reviewController.getReviewId);
router.get("/get-all-review", reviewController.getAllReview);
router.patch("/update-review/:id", reviewController.updateReview);
router.delete("/delete-review/:id", reviewController.deleteReview);

module.exports = router;
