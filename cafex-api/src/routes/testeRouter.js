import express from "express";
import testeController from "../controllers/testeController.js";

const testeRouter = express.Router();

testeRouter.get("/txtBotao", testeController.getTxtBotaoController);

export default testeRouter;
