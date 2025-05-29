import express from "express";
import AlunoController from "../controllers/AlunoController.js";

const alunoRouter = express.Router();

alunoRouter.post("/alunos", AlunoController.createAluno);
alunoRouter.get("/alunos", AlunoController.listAllAlunos);
alunoRouter.get("/alunos/:ra", AlunoController.getAlunoByRa);
alunoRouter.put("/alunos/:ra", AlunoController.updateAluno);
alunoRouter.delete("/alunos/:ra", AlunoController.deleteAluno);

export default alunoRouter;
