import MatriculaModel from "../models/matriculaModel.js";
import AlunoModel from "../models/alunoModel.js";
import OficinaModel from "../models/oficinaModel.js";
import logError from "../logs/logError.js";

class MatriculaService {
  static validateFields(data) {
    const requiredFields = ["alunoId", "oficinaId"];
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = new Error(`Campo obrigatório "${field}" não foi preenchido.`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  static async createMatricula(data) {
    try {
      this.validateFields(data);
      const aluno = await AlunoModel.getById(data.alunoId);
      if (!aluno) {
        const error = new Error("Aluno não encontrado.");
        error.statusCode = 404;
        throw error;
      }
      const oficina = await OficinaModel.getById(data.oficinaId);
      if (!oficina) {
        const error = new Error("Oficina não encontrada.");
        error.statusCode = 404;
        throw error;
      }

      return await MatriculaModel.create(data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAllMatriculas() {
    try {
      return await MatriculaModel.getAll();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getMatriculaById(id) {
    try {
      const matricula = await MatriculaModel.getById(id);
      if (!matricula) {
        const error = new Error("Matrícula não encontrada.");
        error.statusCode = 404;
        throw error;
      }
      return matricula;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async updateMatricula(id, data) {
    try {
      const matricula = await MatriculaModel.getById(id);
      if (!matricula) {
        const error = new Error("Matrícula não encontrada para atualização.");
        error.statusCode = 404;
        throw error;
      }
      return await MatriculaModel.update(id, data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deleteMatricula(id) {
    try {
      const matricula = await MatriculaModel.getById(id);
      if (!matricula) {
        const error = new Error("Matrícula não encontrada para exclusão.");
        error.statusCode = 404;
        throw error;
      }
      return await MatriculaModel.delete(id);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getMatriculasByOficinaId(oficinaId) {
    try {
      if (!oficinaId) {
        const error = new Error("ID da oficina é obrigatório.");
        error.statusCode = 400;
        throw error;
      }
      return await MatriculaModel.getByOficinaId(oficinaId);
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}

export default MatriculaService;