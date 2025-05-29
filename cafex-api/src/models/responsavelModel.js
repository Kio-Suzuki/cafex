import prisma from "../database/prisma.js";

class ResponsavelModel {
  static async create(data) {
    return prisma.responsavel.create({ data });
  }

  static async findAll() {
    return prisma.responsavel.findMany();
  }

  static async findById(id) {
    return prisma.responsavel.findUnique({ where: { id } });
  }

  static async update(id, data) {
    return prisma.responsavel.update({ where: { id }, data });
  }

  static async delete(id) {
    return prisma.responsavel.delete({ where: { id } });
  }
}

export default ResponsavelModel;
