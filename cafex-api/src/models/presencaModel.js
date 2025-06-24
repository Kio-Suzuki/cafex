import prisma from "../database/prisma.js";

class PresencaModel {
  static async create(data) {
    return prisma.presenca.create({ data });
  }

  static async getAll(where) {
    return prisma.presenca.findMany({
      where,
      include: {
        matricula: {
          include: {
            aluno: true,
            oficina: true,
          },
        },
      },
    });
  }

  static async getById(id) {
    return prisma.presenca.findUnique({ where: { id } });
  }

  static async update(id, data) {
    return prisma.presenca.update({ where: { id }, data });
  }

  static async delete(id) {
    return prisma.presenca.delete({ where: { id } });
  }
}

export default PresencaModel;
