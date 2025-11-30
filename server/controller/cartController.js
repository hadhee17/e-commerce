const Cart = require("../model/cart");

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userId = req.user.id;

    // Check if product already in the cart
    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: userId,
        product: productId,
        quantity: 1,
      });
    }

    res.status(200).json({
      status: "success",
      cartItem,
    });
  } catch (error) {
    console.error("Add to cart error", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ user: userId })
      .populate("product", "title price image") // only required fields
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (error) {
    console.error("Get cart error", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    res.status(200).json({
      status: "success",
      message: "Item removed",
    });
  } catch (error) {
    console.error("Remove cart error", error);
    res.status(500).json({ message: "Server error" });
  }
};
