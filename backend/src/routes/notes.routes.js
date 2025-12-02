import {Router} from "express"
import { createNotes, deleteNotes, getAllNotes, getNote, updateNotes } from "../controllers/notes.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router=Router();
router.route('/create').post(verifyJwt,createNotes)
router.route('/all').get(verifyJwt,getAllNotes)
router.route('/update/:noteId').patch(verifyJwt,updateNotes)
router.route('/delete/:noteId').delete(verifyJwt,deleteNotes)
router.route('/get/:noteId').get(verifyJwt,getNote)
export default router;
