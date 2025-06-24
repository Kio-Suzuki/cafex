import express from 'express';
import AlunoController from '../controllers/alunoController.js';

const alunoRouter = express.Router();

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Aluno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *             required:
 *               - nome
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 */
alunoRouter.post('/alunos', AlunoController.createAluno);

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Aluno]
 *     responses:
 *       200:
 *         description: Lista de alunos
 */
alunoRouter.get('/alunos', AlunoController.listAllAlunos);

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Busca um aluno pelo ID
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.get('/alunos/:id', AlunoController.getAlunoById);

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno pelo ID
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.put('/alunos/:id', AlunoController.updateAluno);

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove um aluno pelo ID
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno
 *     responses:
 *       204:
 *         description: Aluno removido
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.delete('/alunos/:id', AlunoController.deleteAluno);

export default alunoRouter;
