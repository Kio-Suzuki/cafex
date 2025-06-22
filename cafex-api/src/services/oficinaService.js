import OficinaModel from "../models/oficinaModel.js";
import MatriculaModel from "../models/matriculaModel.js";
import logError from "../logs/logError.js";

class OficinaService {
  static async createOficina(dadosDaOficina) {
    try {
      const { alunos, ...oficinaData } = dadosDaOficina;
      const oficina = await OficinaModel.create(oficinaData);

      if (Array.isArray(alunos) && alunos.length > 0) {
        for (const alunoId of alunos) {
          await MatriculaModel.create({
            alunoId,
            oficinaId: oficina.id,
          });
        }
      }
      return oficina;
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
      const oficina = await OficinaModel.getById(Number(id));
      if (!oficina) {
        const error = new Error("Oficina não encontrada.");
        error.statusCode = 404;
        throw error;
      }
      const matriculas = await MatriculaModel.getAlunosByOficinaId(Number(id));
      return matriculas.length;
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

      const { alunos, ...oficinaData } = dadosParaAtualizar;
      const oficinaAtualizada = await OficinaModel.update(
        Number(id),
        oficinaData
      );

      if (Array.isArray(alunos)) {
        await MatriculaModel.deleteByOficinaId(Number(id));
        for (const alunoId of alunos) {
          await MatriculaModel.create({
            alunoId,
            oficinaId: Number(id),
          });
        }
      }
      return oficinaAtualizada;
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
