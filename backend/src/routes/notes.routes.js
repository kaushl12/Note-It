import {Router} from "express"
import { createNotes, deleteNotes, getAllNotes, getNote, updateNotes } from "../controllers/notes.controllers.js";

const router=Router();
router.route('/create').get(createNotes)
router.route('/all').get(getAllNotes)
router.route('/update/:id').patch(updateNotes)
router.route('/delete/:id').delete(deleteNotes)
router.route('/get/:id').get(getNote)
export default router;
