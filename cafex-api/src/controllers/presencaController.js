import PresencaService from '../services/PresencaService.js';

class PresencaController {
    static async createPresenca(req, res, next) {
        try {
            const novaPresenca = await PresencaService.createPresenca(req.body);
            res.status(201).json(novaPresenca);
        } catch (error) {
            next(error);
        }
    }

    static async listAllPresencas(req, res, next) {
        try {
            const { alunoId, oficinaId, dataInicio, dataFim } = req.query;

            const filter = {
                alunoId: alunoId ? parseInt(alunoId) : undefined,
                oficinaId: oficinaId ? parseInt(oficinaId) : undefined,
                dataInicio: dataInicio || undefined,
                dataFim: dataFim || undefined
            }

            const presencas = await PresencaService.getAllPresencas(filter);
            res.status(200).json(presencas);
        } catch (error) {
            next(error);
        }
    }

    static async getPresencaById(req, res, next) {
        try {
            const { id } = req.params;
            const presenca = await PresencaService.getPresencaById(id);
            res.status(200).json(presenca);
        } catch (error) {
            next(error);
        }
    }

    static async updatePresenca(req, res, next) {
        try {
            const { id } = req.params;
            const presenca = await PresencaService.updatePresenca(id, req.body);
            res.status(200).json(presenca);
        } catch (error) {
            next(error);
        }
    }

    static async deletePresenca(req, res, next) {
        try {
            const { id } = req.params;
            await PresencaService.deletePresenca(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default PresencaController;