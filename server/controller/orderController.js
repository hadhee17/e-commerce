const Order = require("../model/order");
const AppError = require("../utils/appError");

exports.createOrder = async (req, res, next) => {
  try {
    const { product, amount, paymentStatus } = req.body;

    // Check for existing order with same details
    const existingOrder = await Order.findOne({
      user: req.user._id,
      product,
      amount,
      orderAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    });

    if (existingOrder) {
      return res.status(200).json({
        status: "success",
        data: {
          order: existingOrder,
        },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      product,
      amount,
      paymentStatus: paymentStatus || "paid",
      orderAt: Date.now(),
    });

    // Populate product details
    await order.populate("product");

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    console.error("Order Creation Error:", err);
    next(new AppError(err.message || "Failed to create order", 400));
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("product")
      .sort("-orderAt");
    res.status(200).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (err) {
    next(new AppError("Failed to fetch orders", 400));
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only delete their own orders
    });

    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError("Failed to delete booking", 400));
  }
};
