import express from "express";
import PresencaController from "../controllers/presencaController.js";

const presencaRouter = express.Router();

/**
 * @swagger
 * /presencas:
 *   post:
 *     summary: Registra uma nova presença
 *     tags: [Presenca]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataPresenca:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *               observacoes:
 *                 type: string
 *               alunoRa:
 *                 type: integer
 *               oficinaId:
 *                 type: integer
 *             required:
 *               - dataPresenca
 *               - status
 *               - alunoRa
 *               - oficinaId
 *     responses:
 *       201:
 *         description: Presença registrada
 */
presencaRouter.post("/presencas", PresencaController.createPresenca);

/**
 * @swagger
 * /presencas:
 *   get:
 *     summary: Lista todas as presenças (com filtros opcionais)
 *     tags: [Presenca]
 *     parameters:
 *       - in: query
 *         name: alunoRa
 *         schema:
 *           type: integer
 *         description: RA do aluno
 *       - in: query
 *         name: oficinaId
 *         schema:
 *           type: integer
 *         description: ID da oficina
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final
 *     responses:
 *       200:
 *         description: Lista de presenças
 */
presencaRouter.get("/presencas", PresencaController.listAllPresencas);

/**
 * @swagger
 * /presencas/{id}:
 *   get:
 *     summary: Busca uma presença pelo ID
 *     tags: [Presenca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da presença
 *     responses:
 *       200:
 *         description: Presença encontrada
 *       404:
 *         description: Presença não encontrada
 */
presencaRouter.get("/presencas/:id", PresencaController.getPresencaById);

/**
 * @swagger
 * /presencas/{id}:
 *   put:
 *     summary: Atualiza uma presença pelo ID
 *     tags: [Presenca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da presença
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataPresenca:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *               observacoes:
 *                 type: string
 *               alunoRa:
 *                 type: integer
 *               oficinaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Presença atualizada
 *       404:
 *         description: Presença não encontrada
 */
presencaRouter.put("/presencas/:id", PresencaController.updatePresenca);

/**
 * @swagger
 * /presencas/{id}:
 *   delete:
 *     summary: Remove uma presença pelo ID
 *     tags: [Presenca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da presença
 *     responses:
 *       204:
 *         description: Presença removida
 *       404:
 *         description: Presença não encontrada
 */
presencaRouter.delete("/presencas/:id", PresencaController.deletePresenca);

/**
 * @swagger
 * /presencas/lote:
 *   post:
 *     summary: Registra presenças em lote
 *     tags: [Presenca]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               presencas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dataPresenca:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *                     observacoes:
 *                       type: string
 *                     alunoRa:
 *                       type: integer
 *                     oficinaId:
 *                       type: integer
 *                 minItems: 1
 *             required:
 *               - presencas
 *     responses:
 *       201:
 *         description: Presenças registradas
 */
presencaRouter.post("/presencas/lote", PresencaController.createMultiplePresenca);

export default presencaRouter;
