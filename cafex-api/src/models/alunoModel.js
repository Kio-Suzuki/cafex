import prisma from '../database/prisma.js';

class AlunoModel {
    static async create(data) {
        return prisma.aluno.create({
            data,
        });
    }

    static async getAll() {
        return prisma.aluno.findMany();
    }

    static async getById(id) {
        return prisma.aluno.findUnique({
            where: { id },
        });
    }

    static async update(id, data) {
        return prisma.aluno.update({
            where: { id },
            data,
        });
    }

    static async delete(id) {
        return prisma.aluno.delete({
            where: { id },
        });
    }
}

export default AlunoModel;