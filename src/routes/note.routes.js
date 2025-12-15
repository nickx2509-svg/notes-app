import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { createNote } from '../controllers/note.controllers.js';

const noteRouter = Router();

noteRouter.route("/note").post( verifyJWT, createNote )

export { noteRouter }