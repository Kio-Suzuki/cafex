import AlunoService from "../services/AlunoService.js";

class AlunoController {
  static async createAluno(req, res, next) {
    try {
      const novoAluno = await AlunoService.createAluno(req.body);
      res.status(201).json(novoAluno);
    } catch (error) {
      next(error);
    }
  }

  static async listAllAlunos(req, res, next) {
    try {
      const alunos = await AlunoService.getAllAlunos();
      res.status(200).json(alunos);
    } catch (error) {
      next(error);
    }
  }

  static async getAlunoByRa(req, res, next) {
    try {
      const { ra } = req.params;
      const aluno = await AlunoService.getAlunoByRa(Number(ra));
      res.status(200).json(aluno);
    } catch (error) {
      next(error);
    }
  }

  static async updateAluno(req, res, next) {
    try {
      const { ra } = req.params;
      const aluno = await AlunoService.updateAluno(Number(ra), req.body);
      res.status(200).json(aluno);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAluno(req, res, next) {
    try {
      const { ra } = req.params;
      await AlunoService.deleteAluno(Number(ra));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default AlunoController;
