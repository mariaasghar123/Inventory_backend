import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = express.Router();

// ✅ Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        role: role || "user",
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created", user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ Login route
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find user
//     const user = await prisma.user.findUnique({ where: { username } });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid username or password" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid username or password" });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET || "secretkey", // apna secret env me rakho
//       { expiresIn: "1d" }
//     );

//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed" });
//   }
// });
// ✅ Login route (updated)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // ✅ role bhi token me hai
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // ✅ Frontend ko token + user dono bhejo
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role, // admin/salesman/user
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
