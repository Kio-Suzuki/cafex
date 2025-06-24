import PresencaService from '../services/presencaService.js';

class PresencaController {
  static async createPresenca(req, res, next) {
    try {
      const novaPresenca = await PresencaService.createPresenca(req.body);
      res.status(201).json(novaPresenca);
    } catch (error) {
      next(error);
    }
  }

  static async createMultiplePresenca(req, res, next) {
    try {
      const { presencas } = req.body;
      if (!Array.isArray(presencas)) {
        return res
          .status(400)
          .json({
            status: 'erro',
            message: 'presencas wrong format (not array)',
          });
      }
      const result = await PresencaService.createMultiplePresenca(presencas);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listAllPresencas(req, res, next) {
    try {
      const { matriculaId, oficinaId, dataInicio, dataFim } = req.query;
      const filter = {
        matriculaId: matriculaId ? parseInt(matriculaId) : undefined,
        oficinaId: oficinaId ? parseInt(oficinaId) : undefined,
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
      };
      const presencas = await PresencaService.getAllPresencas(filter);
      res.status(200).json(presencas);
    } catch (error) {
      next(error);
    }
  }

  static async getPresencaById(req, res, next) {
    try {
      const { id } = req.params;
      const presenca = await PresencaService.getPresencaById(id);
      if (!presenca)
        return res.status(404).json({ message: 'Presença não encontrada' });
      res.status(200).json(presenca);
    } catch (error) {
      next(error);
    }
  }

  static async updatePresenca(req, res, next) {
    try {
      const { id } = req.params;
      const presencaAtualizada = await PresencaService.updatePresenca(
        id,
        req.body
      );
      res.status(200).json(presencaAtualizada);
    } catch (error) {
      next(error);
    }
  }

  static async deletePresenca(req, res, next) {
    try {
      const { id } = req.params;
      await PresencaService.deletePresenca(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default PresencaController;
