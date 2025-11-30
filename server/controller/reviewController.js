const Review = require("../model/review");
const AppError = require("../utils/appError");

exports.createReview = async (req, res, next) => {
  try {
    if (!req.body.product) req.body.product = req.params.productId;

    if (!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);
    res.status(201).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(new AppError(`Error in creating review: ${error.message}`, 404));
  }
};

exports.getAllReview = async (req, res, next) => {
  try {
    const review = await Review.find();
    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(new AppError(`Error in getting all review ${error.message}`, 404));
  }
};

exports.getReviewId = async (req, res, next) => {
  try {
    const review = await Review.find({ product: req.params.id }).populate(
      "user"
    );

    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(new AppError(`Error in getting review ${error.message}`, 404));
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(new AppError(`Error in updating review ${error.message}`, 404));
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(`Error in deleting review ${error.message}`, 404));
  }
};
