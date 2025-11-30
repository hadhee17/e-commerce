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
    });
    res.status(201).json({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    next(new AppError(`Error creating product: ${error.message}`, 400));
  }
};
