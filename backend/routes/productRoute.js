import express from "express";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
const router = express.Router();

// @desc FETCH ALL PRODUCTS
// @route GET /api/products
// @access PUBLIC
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const product = await Product.find({});
    res.json(product);
  })
);

// @desc FETCH PRODUCT BY ID
// @route GET /api/products/:id
// @access PUBLIC
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found.");
    }
  })
);

export default router;
