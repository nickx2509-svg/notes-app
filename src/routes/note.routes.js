import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { createNote, deleteNote, getNote,singleNote,updateNote } from '../controllers/note.controllers.js';

const noteRouter = Router();

noteRouter.route("/note").post( verifyJWT, createNote )
noteRouter.route('/').get( verifyJWT ,getNote)
noteRouter.route('/:noteId').get( verifyJWT,singleNote)
noteRouter.route('/:noteId').put( verifyJWT , updateNote)
noteRouter.route('/:noteId').delete( verifyJWT , deleteNote)

export { noteRouter }