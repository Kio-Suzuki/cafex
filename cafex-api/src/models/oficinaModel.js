import prisma from '../database/prisma.js';

class OficinaModel {
    static async create(dadosDaOficina) {
        return prisma.oficina.create({
            data: dadosDaOficina,
        });
    }

    static async getAll() {
        return prisma.oficina.findMany();
    }

    static async getById(id) {
        return prisma.oficina.findUnique({
            where: { id },
        });
    }

    static async update(id, dadosParaAtualizar) {
        return prisma.oficina.update({
            where: { id },
            data: dadosParaAtualizar,
        });
    }

    static async delete(id) {
        return prisma.oficina.delete({
            where: { id },
        });
    }
}

export default OficinaModel;