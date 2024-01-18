import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.route("/register")
    .post(authController.registerUser);

router.route("/login")
    .post(authController.loginUser);

export default router;
