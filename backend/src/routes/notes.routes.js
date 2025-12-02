import {Router} from "express"
import { createNotes, deleteNotes, getAllNotes, getNote, updateNotes } from "../controllers/notes.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router=Router();
router.use(verifyJwt)
router.route('/create').post(createNotes)
router.route('/all').get(getAllNotes)
router.route('/update/:noteId').patch(updateNotes)
router.route('/delete/:noteId').delete(deleteNotes)
router.route('/get/:noteId').get(getNote)
export default router;
