import { Router } from "express";
import { 
  createNotes, 
  deleteNotes, 
  getAllNotes, 
  getNote, 
  updateNotes 
} from "../controllers/notes.controllers.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { noteLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Authenticate user first
router.use(verifyJwt);

// Apply limiter PER ROUTE (correct)
router.route("/create").post(noteLimiter, createNotes);
router.route("/all").get(noteLimiter, getAllNotes);
router.route("/update/:noteId").patch(noteLimiter, updateNotes);
router.route("/delete/:noteId").delete(noteLimiter, deleteNotes);
router.route("/get/:noteId").get(noteLimiter, getNote);

export default router;
