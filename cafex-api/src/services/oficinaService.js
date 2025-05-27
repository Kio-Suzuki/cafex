import OficinaModel from '../models/oficinaModel.js';
import { logError } from '../utils/logger.js';

class OficinaService {
    static async createOficina(dadosDaOficina) {
        try {
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

            return await OficinaModel.create(dadosDaOficina);
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async getAllOficinas() {
        try {
            return await OficinaModel.getAll();
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async getOficinaById(id) {
        try {
            const oficina = await OficinaModel.getById(id);
            if (!oficina) {
                const error = new Error('Oficina não encontrada.');
                error.statusCode = 404;
                throw error;
            }
            return oficina;
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async updateOficina(id, dadosParaAtualizar) {
        try {
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

            return await OficinaModel.update(id, dadosParaAtualizar);
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async deleteOficina(id) {
        try {
            const oficinaExistente = await OficinaModel.getById(id);
            if (!oficinaExistente) {
                const error = new Error('Oficina não encontrada para exclusão.');
                error.statusCode = 404;
                throw error;
            }
            return await OficinaModel.delete(id);
        } catch (err) {
            logError(err);
            throw err;
        }
    }
}
export default OficinaService;