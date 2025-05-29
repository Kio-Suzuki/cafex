import OficinaService from "../services/oficinaService.js";

class OficinaController {
  static async createOficina(req, res, next) {
    try {
      const novaOficina = await OficinaService.createOficina(req.body);
      res.status(201).json(novaOficina);
    } catch (error) {
      next(error);
    }
  }

  static async listAllOficinas(req, res, next) {
    try {
      const oficinas = await OficinaService.getAllOficinas();
      res.status(200).json(oficinas);
    } catch (error) {
      next(error);
    }
  }

  static async getOficinaById(req, res, next) {
    try {
      const { id } = req.params;
      const oficina = await OficinaService.getOficinaById(id);
      res.status(200).json(oficina);
    } catch (error) {
      next(error);
    }
  }

  static async updateOficina(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaAtualizada = await OficinaService.updateOficina(
        id,
        req.body
      );
      res.status(200).json(oficinaAtualizada);
    } catch (error) {
      next(error);
    }
  }

  static async deleteOficina(req, res, next) {
    try {
      const { id } = req.params;
      await OficinaService.deleteOficina(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default OficinaController;
