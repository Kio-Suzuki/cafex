import PresencaModel from "../models/presencaModel.js";
import OficinaModel from "../models/oficinaModel.js";
import AlunoModel from "../models/alunoModel.js";

import logError from "../logs/logError.js";

class PresencaService {
  static validateFields(data) {
    const requiredFields = ["dataPresenca", "status", "alunoRa", "oficinaId"];
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = new Error(
          `Campo obrigatório "${field}" não foi preenchido.`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    if (typeof data.dataPresenca === "string") {
      const date = new Date(data.dataPresenca);
      if (isNaN(date.getTime())) {
        const error = new Error('Formato de "dataPresenca" inválido.');
        error.statusCode = 400;
        throw error;
      }
      data.dataPresenca = date;
    }
  }

  static async createPresenca(data) {
    try {
      this.validateFields(data);

      data.alunoRa = parseInt(data.alunoRa);
      data.oficinaId = parseInt(data.oficinaId);

      const oficina = await OficinaModel.getById(data.oficinaId);
      if (!oficina) throw new Error("Oficina não encontrada.");

      const aluno = await AlunoModel.getByRa(data.alunoRa);
      if (!aluno) throw new Error("Aluno não encontrado.");

      return await PresencaModel.create(data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAllPresencas(filter) {
    try {
      const where = {};

      if (filter.alunoRa) {
        where.alunoRa = parseInt(filter.alunoRa);
      }

      if (filter.oficinaId) {
        where.oficinaId = parseInt(filter.oficinaId);
      }

      if (filter.dataInicio || filter.dataFim) {
        where.dataPresenca = {};
        if (filter.dataInicio) {
          where.dataPresenca.gte = new Date(filter.dataInicio);
        }
        if (filter.dataFim) {
          where.dataPresenca.lte = new Date(filter.dataFim);
        }
      }

      return await PresencaModel.getAll(where);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getPresencaById(id) {
    try {
      const presenca = await PresencaModel.getById(parseInt(id));
      if (!presenca) {
        const error = new Error("Presenca não encontrada.");
        error.statusCode = 404;
        throw error;
      }
      return presenca;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async updatePresenca(id, data) {
    try {
      const presenca = await PresencaModel.getById(parseInt(id));
      if (!presenca) {
        const error = new Error("Presenca não encontrada para atualização.");
        error.statusCode = 404;
        throw error;
      }

      if (data?.dataPresenca && typeof data.dataPresenca === "string") {
        const date = new Date(data.dataPresenca);
        if (isNaN(date.getTime())) {
          const error = new Error('Formato de "dataPresenca" inválido.');
          error.statusCode = 400;
          throw error;
        }
        data.dataPresenca = date;
      }

      return await PresencaModel.update(parseInt(id), data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deletePresenca(id) {
    try {
      const presenca = await PresencaModel.getById(parseInt(id));
      if (!presenca) {
        const error = new Error("Presenca não encontrada para exclusão.");
        error.statusCode = 404;
        throw error;
      }
      return await PresencaModel.delete(parseInt(id));
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}
export default PresencaService;
