import express from "express";
import AlunoController from "../controllers/AlunoController.js";

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
 *               ra:
 *                 type: integer
 *               nome:
 *                 type: string
 *             required:
 *               - ra
 *               - nome
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 */
alunoRouter.post("/alunos", AlunoController.createAluno);

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
alunoRouter.get("/alunos", AlunoController.listAllAlunos);

/**
 * @swagger
 * /alunos/{ra}:
 *   get:
 *     summary: Busca um aluno pelo RA
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: ra
 *         schema:
 *           type: integer
 *         required: true
 *         description: RA do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.get("/alunos/:ra", AlunoController.getAlunoByRa);

/**
 * @swagger
 * /alunos/{ra}:
 *   put:
 *     summary: Atualiza um aluno pelo RA
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: ra
 *         schema:
 *           type: integer
 *         required: true
 *         description: RA do aluno
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
alunoRouter.put("/alunos/:ra", AlunoController.updateAluno);

/**
 * @swagger
 * /alunos/{ra}:
 *   delete:
 *     summary: Remove um aluno pelo RA
 *     tags: [Aluno]
 *     parameters:
 *       - in: path
 *         name: ra
 *         schema:
 *           type: integer
 *         required: true
 *         description: RA do aluno
 *     responses:
 *       204:
 *         description: Aluno removido
 *       404:
 *         description: Aluno não encontrado
 */
alunoRouter.delete("/alunos/:ra", AlunoController.deleteAluno);

export default alunoRouter;
