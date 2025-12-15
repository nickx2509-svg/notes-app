import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

const limit = "20mb";

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit }));
app.use(express.urlencoded({ extended: true, limit }));

app.use(cookieParser());


// router routes
import { router } from "./routes/user.routes.js";

import { noteRouter } from "./routes/note.routes.js"


app.use('/api/v1/user',router)

app.use('/api/v1/note',noteRouter)

export { app };
