import AlunoService from '../services/alunoService.js';

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

  static async getAlunoById(req, res, next) {
    try {
      const { id } = req.params;
      const aluno = await AlunoService.getAlunoById(Number(id));
      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
      res.status(200).json(aluno);
    } catch (error) {
      next(error);
    }
  }

  static async updateAluno(req, res, next) {
    try {
      const { id } = req.params;
      const aluno = await AlunoService.updateAluno(Number(id), req.body);
      res.status(200).json(aluno);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAluno(req, res, next) {
    try {
      const { id } = req.params;
      await AlunoService.deleteAluno(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default AlunoController;
