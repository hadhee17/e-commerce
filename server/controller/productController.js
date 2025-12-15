const Product = require("../model/product");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAllProducts = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Product.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query; // IMPORTANT!

    res.status(200).json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (err) {
    next(new AppError("error fetching all product", 404));
  }
};

exports.getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    product,
  });
};

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      rating: req.body.rating,
      seller: req.user.id,
    });
    res.status(201).json({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    next(new AppError(`Error creating product: ${error.message}`, 400));
  }
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.user.id, // 🔥 key line
    });
    console.log(products);

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    next(new AppError(`error in getting my products: ${error}`));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id, // 🔒 ownership check
    });

    if (!product) {
      return next(
        new AppError("Product not found or you are not authorized", 404)
      );
    }

    // Update allowed fields
    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.status(200).json({
      status: "success",
      product: updatedProduct,
    });
  } catch (error) {
    next(new AppError(`Error updating product: ${error.message}`, 400));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id, // 🔒 ownership check
    });

    if (!product) {
      return next(
        new AppError("Product not found or you are not authorized", 404)
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(`Error deleting product: ${error.message}`, 400));
  }
};
