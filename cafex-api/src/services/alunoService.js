import AlunoModel from '../models/AlunoModel.js';

import { logError } from '../utils/logger.js';

class AlunoService {

    static validateFields(data) {
        const requiredFields = ['ra', 'nome'];
        for(const field of requiredFields){
            if(!data[field]){
                const error = new Error(`Campo obrigatório "${field}" não foi preenchido.`);
                error.statusCode = 400;
                throw error;
            }
        }
    }

    static async createAluno(data) {
        try {
            //Valida campos obrigatorios
            this.validateFields(data);

            return await AlunoModel.create(data);
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async getAllAlunos() {
        try {
            return await AlunoModel.getAll();
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async getAlunoById(id) {
        try {
            const aluno = await AlunoModel.getById(id);
            if (!aluno) {
                const error = new Error('Aluno não encontrado.');
                error.statusCode = 404;
                throw error;
            }
            return aluno;
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async updateAluno(id, data) {
        try {
            const aluno = await AlunoModel.getById(id);
            if (!aluno) {
                const error = new Error('Aluno não encontrado para atualização.');
                error.statusCode = 404;
                throw error;
            }

            return await AlunoModel.update(id, data);
        } catch (err) {
            logError(err);
            throw err;
        }
    }

    static async deleteAluno(id) {
        try {
            const aluno = await AlunoModel.getById(id);
            if (!aluno) {
                const error = new Error('Aluno não encontrado para exclusão.');
                error.statusCode = 404;
                throw error;
            }
            return await AlunoModel.delete(id);
        } catch (err) {
            logError(err);
            throw err;
        }
    }
}
export default AlunoService;