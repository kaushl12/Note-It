import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router=Router()
router.route('/login').post(login)
router.route('/register').post(register)


router.route('/logout').post(verifyJwt,logout)
router.route('/refresh-token').post(refreshAccessToken)

export default router;