import {
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post();

export default router;
