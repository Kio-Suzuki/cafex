import express from 'express';
import PresencaController from '../controllers/presencaController.js';

const presencaRouter = express.Router();

presencaRouter.post('/presencas', PresencaController.createPresenca);       
presencaRouter.get('/presencas', PresencaController.listAllPresencas);
presencaRouter.get('/presencas/:id', PresencaController.getPresencaById);
presencaRouter.put('/presencas/:id', PresencaController.updatePresenca);
presencaRouter.delete('/presencas/:id', PresencaController.deletePresenca);

export default presencaRouter;