import express from 'express';
import AlunoController from '../controllers/AlunoController.js';

const alunoRouter = express.Router();

alunoRouter.post('/alunos', AlunoController.createAluno);       
alunoRouter.get('/alunos', AlunoController.listAllAlunos);
alunoRouter.get('/alunos/:id', AlunoController.getAlunoById);
alunoRouter.put('/alunos/:id', AlunoController.updateAluno);
alunoRouter.delete('/alunos/:id', AlunoController.deleteAluno);

export default alunoRouter;