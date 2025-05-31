import OficinaModel from "../models/oficinaModel.js";
import logError from "../logs/logError.js";

class OficinaService {
  static async createOficina(dadosDaOficina) {
    try {
      if (
        !dadosDaOficina.nome ||
        !dadosDaOficina.horarioInicio ||
        !dadosDaOficina.horarioFim
      ) {
        const error = new Error(
          'Os campos "nome", "horarioInicio" e "horarioFim" são obrigatórios.'
        );
        error.statusCode = 400;
        throw error;
      }

      if (typeof dadosDaOficina.horarioInicio === "string") {
        const date = new Date(dadosDaOficina.horarioInicio);
        if (isNaN(date.getTime())) {
          const error = new Error('Formato de "horarioInicio" inválido.');
          error.statusCode = 400;
          throw error;
        }
        dadosDaOficina.horarioInicio = date;
      }
      if (typeof dadosDaOficina.horarioFim === "string") {
        const date = new Date(dadosDaOficina.horarioFim);
        if (isNaN(date.getTime())) {
          const error = new Error('Formato de "horarioFim" inválido.');
          error.statusCode = 400;
          throw error;
        }
        dadosDaOficina.horarioFim = date;
      }

      return await OficinaModel.create(dadosDaOficina);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAllOficinas() {
    try {
      return await OficinaModel.getAll();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getOficinaById(id) {
    try {
      const oficina = await OficinaModel.getById(Number(id));
      if (!oficina) {
        const error = new Error("Oficina não encontrada.");
        error.statusCode = 404;
        throw error;
      }
      return oficina;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async updateOficina(id, dadosParaAtualizar) {
    try {
      const oficinaExistente = await OficinaModel.getById(Number(id));
      if (!oficinaExistente) {
        const error = new Error("Oficina não encontrada para atualização.");
        error.statusCode = 404;
        throw error;
      }

      if (
        dadosParaAtualizar.horarioInicio &&
        typeof dadosParaAtualizar.horarioInicio === "string"
      ) {
        const date = new Date(dadosParaAtualizar.horarioInicio);
        if (isNaN(date.getTime())) {
          const error = new Error('Formato de "horarioInicio" inválido.');
          error.statusCode = 400;
          throw error;
        }
        dadosParaAtualizar.horarioInicio = date;
      }
      if (
        dadosParaAtualizar.horarioFim &&
        typeof dadosParaAtualizar.horarioFim === "string"
      ) {
        const date = new Date(dadosParaAtualizar.horarioFim);
        if (isNaN(date.getTime())) {
          const error = new Error('Formato de "horarioFim" inválido.');
          error.statusCode = 400;
          throw error;
        }
        dadosParaAtualizar.horarioFim = date;
      }

      return await OficinaModel.update(Number(id), dadosParaAtualizar);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deleteOficina(id) {
    try {
      const oficinaExistente = await OficinaModel.getById(Number(id));
      if (!oficinaExistente) {
        const error = new Error("Oficina não encontrada para exclusão.");
        error.statusCode = 404;
        throw error;
      }
      return await OficinaModel.delete(Number(id));
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}
export default OficinaService;
