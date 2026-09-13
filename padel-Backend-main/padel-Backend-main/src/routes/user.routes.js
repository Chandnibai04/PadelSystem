import { Router } from "express";
import { signup, login, forgotPassword, resetPassword, updateUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // 🔑 new route
router.post("/reset-password/:token", resetPassword); // 🔑 new route
router.put("/:id", updateUser);
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
