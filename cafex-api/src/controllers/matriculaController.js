import MatriculaService from "../services/matriculaService.js";

const MatriculaController = {
  async create(req, res) {
    try {
      const matricula = await MatriculaService.createMatricula(req.body);
      res.status(201).json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const matriculas = await MatriculaService.getAllMatriculas();
      res.json(matriculas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const matricula = await MatriculaService.getMatriculaById(req.params.id);
      res.json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const matricula = await MatriculaService.updateMatricula(req.params.id, req.body);
      res.json(matricula);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await MatriculaService.deleteMatricula(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },
};

export default MatriculaController;