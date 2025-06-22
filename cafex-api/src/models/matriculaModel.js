import prisma from "../database/prisma.js";

const MatriculaModel = {
  async create(data) {
    return await prisma.matricula.create({ data });
  },

  async getAll() {
    return await prisma.matricula.findMany({
      include: {
        aluno: true,
        oficina: true,
        presencas: true,
      },
    });
  },

  async getById(id) {
    return await prisma.matricula.findUnique({
      where: { id: Number(id) },
      include: {
        aluno: true,
        oficina: true,
        presencas: true,
      },
    });
  },

  async update(id, data) {
    return await prisma.matricula.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return await prisma.matricula.delete({
      where: { id: Number(id) },
    });
  },
};

export default MatriculaModel;