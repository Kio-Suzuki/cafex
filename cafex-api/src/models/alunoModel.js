import prisma from "../database/prisma.js";

class AlunoModel {
  static async create(data) {
    return prisma.aluno.create({
      data,
    });
  }

  static async getAll() {
    return prisma.aluno.findMany();
  }

  static async getByRa(ra) {
    return prisma.aluno.findUnique({
      where: { ra },
    });
  }

  static async update(ra, data) {
    return prisma.aluno.update({
      where: { ra },
      data,
    });
  }

  static async delete(ra) {
    return prisma.aluno.delete({
      where: { ra },
    });
  }
}

export default AlunoModel;
