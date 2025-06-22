import OficinaModel from "../models/oficinaModel.js";
import logError from "../logs/logError.js";

class OficinaService {
  static async createOficina(dadosDaOficina) {
    try {
      if (
        !dadosDaOficina.nome ||
        !Array.isArray(dadosDaOficina.diaSemana) ||
        dadosDaOficina.diaSemana.length === 0
      ) {
        const error = new Error(
          'Os campos "nome" e "diaSemana" (com pelo menos um dia) são obrigatórios.'
        );
        error.statusCode = 400;
        throw error;
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

  static async getQtdAlunos(id) {
    try {
      //todo finalizar apos mudanca do banco
      // const oficina = await OficinaModel.getById(Number(id));
      // if (!oficina) {
      //   const error = new Error("Oficina não encontrada.");
      //   error.statusCode = 404;
      //   throw error;
      // }
      // return oficina;
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
