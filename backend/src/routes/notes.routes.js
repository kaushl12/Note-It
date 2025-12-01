import {Router} from "express"
import { createNotes, deleteNotes, getAllNotes, getNote, updateNotes } from "../controllers/notes.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router=Router();
router.route('/create').post(verifyJwt,createNotes)
router.route('/all').get(getAllNotes)
router.route('/update/:id').patch(updateNotes)
router.route('/delete/:id').delete(deleteNotes)
router.route('/get/:id').get(getNote)
export default router;
