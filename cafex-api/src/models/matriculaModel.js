import prisma from "../database/prisma.js";

class MatriculaModel {
  static async create(data) {
    return prisma.matricula.create({ data });
  }

  static async deleteByOficinaId(oficinaId) {
    return prisma.matricula.deleteMany({
      where: { oficinaId: Number(oficinaId) },
    });
  }

  static async getAll() {
    return await prisma.matricula.findMany({
      include: {
        aluno: true,
        oficina: true,
        presencas: true,
      },
    });
  }

  static async getById(id) {
    return await prisma.matricula.findUnique({
      where: { id: Number(id) },
      include: {
        aluno: true,
        oficina: true,
        presencas: true,
      },
    });
  }

  static async update(id, data) {
    return await prisma.matricula.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async delete(id) {
    return await prisma.matricula.delete({
      where: { id: Number(id) },
    });
  }

  static async getAlunosByOficinaId(oficinaId) {
    return prisma.matricula.findMany({
      where: { oficinaId },
      include: { aluno: true },
    });
  }

  static async findByAlunoOficina(alunoId, oficinaId) {
    return prisma.matricula.findFirst({
      where: { alunoId, oficinaId },
    });
  }
}

export default MatriculaModel;
