import express from 'express';
import OficinaController from '../controllers/oficinaController.js';

const oficinaRouter = express.Router();

/**
 * @swagger
 * /oficinas:
 *   post:
 *     summary: Cria uma nova oficina
 *     tags: [Oficina]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               diaSemana:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - nome
 *               - diaSemana
 *     responses:
 *       201:
 *         description: Oficina criada com sucesso
 */
router.post('/oficinas', OficinaController.createOficina);

/**
 * @swagger
 * /oficinas:
 *   get:
 *     summary: Lista todas as oficinas
 *     tags: [Oficina]
 *     responses:
 *       200:
 *         description: Lista de oficinas
 */
router.get('/oficinas', OficinaController.listAllOficinas);

/**
 * @swagger
 * /oficinas/{id}:
 *   get:
 *     summary: Busca uma oficina pelo ID
 *     tags: [Oficina]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da oficina
 *     responses:
 *       200:
 *         description: Oficina encontrada
 *       404:
 *         description: Oficina não encontrada
 */
router.get('/oficinas/:id', OficinaController.getOficinaById);

/**
 * @swagger
 * /oficinas/{id}/getQtdAlunos:
 *   get:
 *     summary: Busca a quantidade de alunos de uma oficina pelo ID
 *     tags: [Oficina]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da oficina
 *     responses:
 *       200:
 *         description: Quantidade de Alunos
 */
router.get('/oficinas/:id/getQtdAlunos', OficinaController.getQtdAlunos);

/**
 * @swagger
 * /oficinas/{id}:
 *   put:
 *     summary: Atualiza uma oficina pelo ID
 *     tags: [Oficina]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da oficina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               diaSemana:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Oficina atualizada
 *       404:
 *         description: Oficina não encontrada
 */
router.put('/oficinas/:id', OficinaController.updateOficina);

/**
 * @swagger
 * /oficinas/{id}:
 *   delete:
 *     summary: Remove uma oficina pelo ID
 *     tags: [Oficina]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da oficina
 *     responses:
 *       204:
 *         description: Oficina removida
 *       404:
 *         description: Oficina não encontrada
 */
router.delete('/oficinas/:id', OficinaController.deleteOficina);

export default oficinaRouter;
