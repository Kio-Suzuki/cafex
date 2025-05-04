import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testeRouter from "./routes/testeRouter.js";

dotenv.config({ path: "./.env" });

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4173"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(testeRouter);

export default app;
