import MatriculaService from "../services/matriculaService.js";

class MatriculaController {
  static async create(req, res) {
    try {
      const matricula = await MatriculaService.createMatricula(req.body);
      res.status(201).json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const matriculas = await MatriculaService.getAllMatriculas();
      res.json(matriculas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const matricula = await MatriculaService.getMatriculaById(req.params.id);
      res.json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const matricula = await MatriculaService.updateMatricula(req.params.id, req.body);
      res.json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      await MatriculaService.deleteMatricula(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  static async getByOficinaId(req, res) {
    try {
      const matriculas = await MatriculaService.getMatriculasByOficinaId(req.params.oficinaId);
      res.json(matriculas);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

export default MatriculaController;