import ResponsavelModel from '../models/responsavelModel.js';

class ResponsavelService {
  static async create(data) {
    return ResponsavelModel.create(data);
  }

  static async getAll() {
    return ResponsavelModel.findAll();
  }

  static async getById(id) {
    return ResponsavelModel.findById(id);
  }

  static async update(id, data) {
    return ResponsavelModel.update(id, data);
  }

  static async delete(id) {
    return ResponsavelModel.delete(id);
  }
}

export default ResponsavelService;