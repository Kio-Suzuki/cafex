import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import oficinaRouter from "./routes/oficinaRouter.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config({ path: "./.env" });

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4173"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', oficinaRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API CafeX (ELLP) está funcionando!' });
});


export default app;