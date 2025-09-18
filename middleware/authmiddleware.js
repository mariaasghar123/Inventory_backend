// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ same secret as login
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

      // ✅ yahan aap DB se bhi fetch kar sakte ho (optional)
      // const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      // req.user = user;

      req.user = decoded; // agar decoded me {userId, role} hai to ye kaafi hai
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
