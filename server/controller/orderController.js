const Order = require("../model/order");
const AppError = require("../utils/appError");
const Product = require("../model/product");

exports.createOrder = async (req, res, next) => {
  try {
    const { product } = req.body;

    if (!product) {
      return next(new AppError("Product id is required", 400));
    }

    // 🔎 Fetch product (source of truth)
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return next(new AppError("Product not found", 404));
    }

    // 🔒 Prevent accidental duplicate order (5 min window)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const existingOrder = await Order.findOne({
      user: req.user._id,
      product,
      orderAt: { $gte: fiveMinutesAgo },
    }).populate("product");

    if (existingOrder) {
      return res.status(200).json({
        status: "success",
        data: { order: existingOrder },
      });
    }

    // ✅ Create order
    const order = await Order.create({
      user: req.user._id,
      product: productDoc._id,
      amount: productDoc.price, // 💡 backend-controlled
      paymentStatus: "paid",
    });

    await order.populate("product");

    res.status(201).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    console.error("Order Creation Error:", err);
    next(new AppError(err, 400));
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
