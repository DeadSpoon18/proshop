import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, admin, getUsers);
router.get("/profile", protect, getUserProfile);
router.post("/", registerUser);
router.post("/login", authUser);
router.put("/profile", protect, updateUserProfile);
router.get("/:id", protect, admin, getUserById);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id", protect, admin, updateUser);
export default router;
