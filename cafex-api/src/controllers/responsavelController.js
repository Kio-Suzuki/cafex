import ResponsavelService from '../services/responsavelService.js';

class ResponsavelController {
  static async create(req, res, next) {
    try {
      const responsavel = await ResponsavelService.create(req.body);
      res.status(201).json(responsavel);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const responsaveis = await ResponsavelService.getAll();
      res.json(responsaveis);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const responsavel = await ResponsavelService.getById(Number(req.params.id));
      if (!responsavel) return res.status(404).json({ message: 'Responsável não encontrado' });
      res.json(responsavel);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const responsavel = await ResponsavelService.update(Number(req.params.id), req.body);
      res.json(responsavel);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await ResponsavelService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ResponsavelController;