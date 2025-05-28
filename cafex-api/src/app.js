import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import oficinaRouter from "./routes/oficinaRouter.js";
import presencaRouter from "./routes/presencaRouter.js";
import alunoRouter from "./routes/alunoRouter.js";

import generalErrorHandler from "./middlewares/generalErrorHandler.js";

dotenv.config({ path: "./.env" });

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4173"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', oficinaRouter);
app.use('/api', presencaRouter);
app.use('/api', alunoRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API CafeX (ELLP) está funcionando!' });
});

app.use(generalErrorHandler);

export default app;