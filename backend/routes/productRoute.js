import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, admin, createProduct);
router.get("/top", getTopProducts);
router.post("/:id/reviews", protect, createProductReview);
router.put("/:id", protect, admin, updateProduct);
router.get("/:id", getProductById);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
