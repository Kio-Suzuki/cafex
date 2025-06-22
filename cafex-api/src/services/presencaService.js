import PresencaModel from '../models/presencaModel.js';
import MatriculaModel from '../models/matriculaModel.js';
import logError from '../logs/logError.js';

class PresencaService {
  static validateFields(data) {
    const requiredFields = ["dataPresenca", "status", "matriculaId"];
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
      date.setUTCHours(0, 0, 0, 0);
      data.dataPresenca = date;
    } else if (data.dataPresenca instanceof Date) {
      data.dataPresenca.setUTCHours(0, 0, 0, 0);
    }
  }

  static async createPresenca(data) {
    try {
      this.validateFields(data);

      // Busca matrícula pelo alunoId e oficinaId, se necessário
      if (!data.matriculaId && data.alunoId && data.oficinaId) {
        const matricula = await MatriculaModel.findByAlunoOficina(
          data.alunoId,
          data.oficinaId
        );
        if (!matricula) throw new Error("Matrícula não encontrada.");
        data.matriculaId = matricula.id;
      }

      return await PresencaModel.create(data);
    } catch (err) {
      const isDuplicidade =
        (err.code === "P2002" &&
          err.meta &&
          err.meta.target &&
          err.meta.target.includes("dataPresenca_matriculaId")) ||
        (typeof err.message === "string" &&
          (err.message.includes("Unique constraint failed") ||
            err.message.includes("dataPresenca_matriculaId") ||
            err.message.includes("presença registrada")));
      if (isDuplicidade) {
        const error = new Error(
          "Já existe uma presença registrada para esta matrícula e data."
        );
        error.statusCode = 409;
        throw error;
      }
      logError(err);
      throw err;
    }
  }

  static async createMultiplePresenca(presencas) {
    const results = [];
    for (const data of presencas) {
      try {
        await this.createPresenca(data);
        results.push({ matriculaId: data.matriculaId, status: "ok" });
      } catch (err) {
        results.push({
          matriculaId: data.matriculaId,
          status: "erro",
          message: err.message,
        });
      }
    }
    return results;
  }

  static async getAllPresencas(filter) {
    try {
      const where = {};

      if (filter.matriculaId) {
        where.matriculaId = parseInt(filter.matriculaId);
      }

      if (filter.dataInicio || filter.dataFim) {
        where.dataPresenca = {};
        if (filter.dataInicio) {
          const dataInicio = new Date(filter.dataInicio);
          dataInicio.setUTCHours(0, 0, 0, 0);
          where.dataPresenca.gte = dataInicio;
        }
        if (filter.dataFim) {
          const dataFim = new Date(filter.dataFim);
          dataFim.setUTCHours(0, 0, 0, 0);
          dataFim.setUTCDate(dataFim.getUTCDate() + 1);
          dataFim.setUTCMilliseconds(dataFim.getUTCMilliseconds() - 1);
          where.dataPresenca.lte = dataFim;
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
