import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router=Router()
router.route('/login').post(authLimiter,login)
router.route('/register').post(authLimiter,register)


router.route('/logout').post(verifyJwt,logout)
router.route('/refresh-token').post(refreshAccessToken)

export default router;