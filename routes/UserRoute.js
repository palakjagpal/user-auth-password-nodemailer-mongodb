import { forgotPassword, RegisterUser, ResetPassword } from "../controllers/UserController.js";

import express from "express"

const router = express.Router()

router.post("/register", RegisterUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", ResetPassword)

export default router