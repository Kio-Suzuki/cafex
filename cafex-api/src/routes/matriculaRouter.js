import express from "express";
import MatriculaController from "../controllers/matriculaController.js";

const matriculaRouter = express.Router();

/**
 * @swagger
 * /matriculas:
 *   post:
 *     summary: Cria uma nova matrícula
 *     tags: [Matrícula]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunoId:
 *                 type: integer
 *               oficinaId:
 *                 type: integer
 *             required:
 *               - alunoId
 *               - oficinaId
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 */
router.post("/matriculas", MatriculaController.create);

/**
 * @swagger
 * /matriculas:
 *   get:
 *     summary: Lista todas as matrículas
 *     tags: [Matrícula]
 *     responses:
 *       200:
 *         description: Lista de matrículas
 */
router.get("/matriculas", MatriculaController.getAll);

/**
 * @swagger
 * /matriculas/{id}:
 *   get:
 *     summary: Busca uma matrícula pelo ID
 *     tags: [Matrícula]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula encontrada
 *       404:
 *         description: Matrícula não encontrada
 */
router.get("/matriculas/:id", MatriculaController.getById);

/**
 * @swagger
 * /matriculas/{id}:
 *   put:
 *     summary: Atualiza uma matrícula pelo ID
 *     tags: [Matrícula]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da matrícula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunoId:
 *                 type: integer
 *               oficinaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Matrícula atualizada
 *       404:
 *         description: Matrícula não encontrada
 */
router.put("/matriculas/:id", MatriculaController.update);

/**
 * @swagger
 * /matriculas/{id}:
 *   delete:
 *     summary: Remove uma matrícula pelo ID
 *     tags: [Matrícula]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da matrícula
 *     responses:
 *       204:
 *         description: Matrícula removida
 *       404:
 *         description: Matrícula não encontrada
 */
router.delete("/matriculas/:id", MatriculaController.delete);

export default matriculaRouter;