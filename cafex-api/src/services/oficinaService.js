import OficinaModel from '../models/oficinaModel.js';

class OficinaService {
    static async createOficina(dadosDaOficina) {
        if (!dadosDaOficina.nome || !dadosDaOficina.dataHorario) {
            const error = new Error('Os campos "nome" e "dataHorario" são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        if (dadosDaOficina.dataHorario && typeof dadosDaOficina.dataHorario === 'string') {
            const date = new Date(dadosDaOficina.dataHorario);
            if (isNaN(date.getTime())) {
                const error = new Error('Formato de "dataHorario" inválido.');
                error.statusCode = 400;
                throw error;
            }
            dadosDaOficina.dataHorario = date;
        }

        return OficinaModel.create(dadosDaOficina);
    }

    static async getAllOficinas() {
        return OficinaModel.getAll();
    }

    static async getOficinaById(id) {
        const oficina = await OficinaModel.getById(id);
        if (!oficina) {
            const error = new Error('Oficina não encontrada.');
            error.statusCode = 404;
            throw error;
        }
        return oficina;
    }

    static async updateOficina(id, dadosParaAtualizar) {
        const oficinaExistente = await OficinaModel.getById(id);
        if (!oficinaExistente) {
            const error = new Error('Oficina não encontrada para atualização.');
            error.statusCode = 404;
            throw error;
        }

        if (dadosParaAtualizar.dataHorario && typeof dadosParaAtualizar.dataHorario === 'string') {
            const date = new Date(dadosParaAtualizar.dataHorario);
            if (isNaN(date.getTime())) {
                const error = new Error('Formato de "dataHorario" inválido.');
                error.statusCode = 400;
                throw error;
            }
            dadosParaAtualizar.dataHorario = date;
        }

        return OficinaModel.update(id, dadosParaAtualizar);
    }

    static async deleteOficina(id) {
        const oficinaExistente = await OficinaModel.getById(id);
        if (!oficinaExistente) {
            const error = new Error('Oficina não encontrada para exclusão.');
            error.statusCode = 404;
            throw error;
        }
        return OficinaModel.delete(id);
    }
}

export default OficinaService;