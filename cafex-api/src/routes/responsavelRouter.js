import express from 'express';
import ResponsavelController from '../controllers/responsavelController.js';

const router = express.Router();

router.post('/responsaveis', ResponsavelController.create);
router.get('/responsaveis', ResponsavelController.getAll);
router.get('/responsaveis/:id', ResponsavelController.getById);
router.put('/responsaveis/:id', ResponsavelController.update);
router.delete('/responsaveis/:id', ResponsavelController.delete);

export default router;