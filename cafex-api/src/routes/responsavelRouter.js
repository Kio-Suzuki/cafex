import express from "express";
import ResponsavelController from "../controllers/responsavelController.js";

const router = express.Router();

/**
 * @swagger
 * /responsaveis:
 *   post:
 *     summary: Cria um novo responsável
 *     tags: [Responsavel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeResponsavel:
 *                 type: string
 *               registroResponsavel:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - nomeResponsavel
 *               - registroResponsavel
 *               - senha
 *     responses:
 *       201:
 *         description: Responsável criado com sucesso
 */
router.post("/responsaveis", ResponsavelController.create);

/**
 * @swagger
 * /responsaveis:
 *   get:
 *     summary: Lista todos os responsáveis
 *     tags: [Responsavel]
 *     responses:
 *       200:
 *         description: Lista de responsáveis
 */
router.get("/responsaveis", ResponsavelController.getAll);

/**
 * @swagger
 * /responsaveis/{id}:
 *   get:
 *     summary: Busca um responsável pelo ID
 *     tags: [Responsavel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável
 *     responses:
 *       200:
 *         description: Responsável encontrado
 *       404:
 *         description: Responsável não encontrado
 */
router.get("/responsaveis/:id", ResponsavelController.getById);

/**
 * @swagger
 * /responsaveis/{id}:
 *   put:
 *     summary: Atualiza um responsável pelo ID
 *     tags: [Responsavel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeResponsavel:
 *                 type: string
 *               registroResponsavel:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Responsável atualizado
 *       404:
 *         description: Responsável não encontrado
 */
router.put("/responsaveis/:id", ResponsavelController.update);

/**
 * @swagger
 * /responsaveis/{id}:
 *   delete:
 *     summary: Remove um responsável pelo ID
 *     tags: [Responsavel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável
 *     responses:
 *       204:
 *         description: Responsável removido
 *       404:
 *         description: Responsável não encontrado
 */
router.delete("/responsaveis/:id", ResponsavelController.delete);

export default router;
