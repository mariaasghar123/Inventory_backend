import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get('/', getUsers);          // All users
router.get('/:id', getUserById);    // Single user
router.post('/', createUser);       // Create user
router.put('/:id', updateUser);     // Update user
router.delete('/:id', deleteUser);  // Delete user
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user, // yahan decoded user aayega
  });
});


export default router;
