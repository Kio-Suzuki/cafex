import AlunoModel from "../models/alunoModel.js";

import logError from "../logs/logError.js";

class AlunoService {
  static validateFields(data) {
    const requiredFields = ["ra", "nome"];
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = new Error(
          `Campo obrigatório "${field}" não foi preenchido.`
        );
        error.statusCode = 400;
        throw error;
      }
    }
  }

  static async createAluno(data) {
    try {
      this.validateFields(data);

      return await AlunoModel.create(data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAllAlunos() {
    try {
      return await AlunoModel.getAll();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAlunoByRa(ra) {
    try {
      const aluno = await AlunoModel.getByRa(ra);
      if (!aluno) {
        const error = new Error("Aluno não encontrado.");
        error.statusCode = 404;
        throw error;
      }
      return aluno;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async updateAluno(ra, data) {
    try {
      const aluno = await AlunoModel.getByRa(ra);
      if (!aluno) {
        const error = new Error("Aluno não encontrado para atualização.");
        error.statusCode = 404;
        throw error;
      }

      return await AlunoModel.update(ra, data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deleteAluno(ra) {
    try {
      const aluno = await AlunoModel.getByRa(ra);
      if (!aluno) {
        const error = new Error("Aluno não encontrado para exclusão.");
        error.statusCode = 404;
        throw error;
      }
      return await AlunoModel.delete(ra);
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}
export default AlunoService;
