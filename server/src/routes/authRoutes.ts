import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.route("/register").post(authController.registerUser);

router
  .route("/login")
  .post(authController.loginUser)
  .get(authController.autoLogin);

router
  .route("/auto-login")
  .post(authController.protectRoute, authController.autoLogin);

router.route("/logout").post(authController.logoutUser);

export default router;
