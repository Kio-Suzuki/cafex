import ResponsavelModel from "../models/responsavelModel.js";
import { logError } from "../logs/logError.js";

class ResponsavelService {
  static validateFields(data) {
    const requiredFields = ['nomeResponsavel', 'registroResponsavel'];
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = new Error(`Campo obrigatório "${field}" não foi preenchido.`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  static async create(data) {
    try {
      this.validateFields(data);
      return await ResponsavelModel.create(data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getAll() {
    try {
      return await ResponsavelModel.findAll();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async getById(id) {
    try {
      const responsavel = await ResponsavelModel.findById(id);
      if (!responsavel) {
        const error = new Error("Responsável não encontrado.");
        error.statusCode = 404;
        throw error;
      }
      return responsavel;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async update(id, data) {
    try {
      const responsavel = await ResponsavelModel.findById(id);
      if (!responsavel) {
        const error = new Error("Responsável não encontrado para atualização.");
        error.statusCode = 404;
        throw error;
      }
      return await ResponsavelModel.update(id, data);
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const responsavel = await ResponsavelModel.findById(id);
      if (!responsavel) {
        const error = new Error("Responsável não encontrado para exclusão.");
        error.statusCode = 404;
        throw error;
      }
      return await ResponsavelModel.delete(id);
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}

export default ResponsavelService;
