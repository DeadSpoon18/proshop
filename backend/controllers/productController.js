import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc FETCH ALL PRODUCTS
// @route GET /api/products
// @access PUBLIC
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword // if something like /api/product?= or ?something then we can find using this
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const product = await Product.find({ ...keyword });
  res.json(product);
});

// @desc FETCH PRODUCT BY ID
// @route GET /api/products/:id
// @access PUBLIC
export const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});

// @desc DELETE PRODUCT
// @route DELETE /api/products/:id
// @access PRIVATE/ADMIN
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product deleted" });
  } else {
    res.status(401);
    throw new Error("Product not found");
  }
});

// @desc Create PRODUCT
// @route POST /api/products/
// @access PRIVATE/ADMIN
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update PRODUCT
// @route PUT /api/products/:id
// @access PRIVATE/ADMIN
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const { name, price, countInStock, description, image, brand, category } =
    req.body;
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(401);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3); // -1 sorts in ascending order
  res.json(products);
});
