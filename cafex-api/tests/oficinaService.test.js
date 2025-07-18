import { jest } from '@jest/globals';

await jest.unstable_mockModule('../src/models/oficinaModel.js', () => ({
  default: {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

await jest.unstable_mockModule('../src/logs/logError.js', () => ({
  default: jest.fn(),
}));

const { default: OficinaModel } = await import('../src/models/oficinaModel.js');
const logError = (await import('../src/logs/logError.js')).default;
const { default: OficinaService } = await import('../src/services/oficinaService.js');

describe("OficinaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOficina", () => {
    it("deve criar oficina com dados válidos", async () => {
      const dados = {
        nome: "Oficina Teste",
        diaSemana: "[SEGUNDA]",
      };
      const created = { ...dados };
      OficinaModel.create.mockResolvedValue(created);

      const result = await OficinaService.createOficina(dados);

      expect(OficinaModel.create).toHaveBeenCalledWith({
        nome: "Oficina Teste",
        diaSemana: "[SEGUNDA]",
      });
      expect(result).toEqual(created);
    });

    it("deve lançar erro se campos obrigatórios faltarem", async () => {
      const dados = {
        nome: "Oficina Teste",
        diaSemana: "[SEGUNDA]",
      };

      await expect(OficinaService.createOficina(dados)).rejects.toMatchObject({
        message: 'Os campos "nome" e "diaSemana" são obrigatórios.',
        statusCode: 400,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("getAllOficinas", () => {
    it("deve retornar lista de oficinas", async () => {
      const oficinas = [
        { id: 1, nome: "A" },
        { id: 2, nome: "B" },
      ];
      OficinaModel.getAll.mockResolvedValue(oficinas);

      const result = await OficinaService.getAllOficinas();

      expect(OficinaModel.getAll).toHaveBeenCalled();
      expect(result).toEqual(oficinas);
    });

    it("deve logar e lançar erro se getAll falhar", async () => {
      const error = new Error("Erro genérico");
      OficinaModel.getAll.mockRejectedValue(error);

      await expect(OficinaService.getAllOficinas()).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("getOficinaById", () => {
    it("deve retornar oficina existente", async () => {
      const oficina = { id: 1, nome: "Oficina 1" };
      OficinaModel.getById.mockResolvedValue(oficina);

      const result = await OficinaService.getOficinaById(1);

      expect(OficinaModel.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(oficina);
    });

    it("deve lançar erro 404 se oficina não encontrada", async () => {
      OficinaModel.getById.mockResolvedValue(null);

      await expect(OficinaService.getOficinaById(999)).rejects.toMatchObject({
        message: "Oficina não encontrada.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("updateOficina", () => {
    it("deve atualizar oficina com dados válidos e datas string", async () => {
      const oficinaExistente = { id: 1, nome: "Oficina 1" };
      const dadosParaAtualizar = {
        nome: "Oficina Atualizada",
        diaSemana: "[TERCA]",
      };
      OficinaModel.getById.mockResolvedValue(oficinaExistente);
      OficinaModel.update.mockResolvedValue({
        ...oficinaExistente,
        ...dadosParaAtualizar
      });

      const result = await OficinaService.updateOficina(1, dadosParaAtualizar);

      expect(OficinaModel.getById).toHaveBeenCalledWith(1);
      expect(OficinaModel.update).toHaveBeenCalledWith(1, {
        nome: "Oficina Atualizada",
        diaSemana: "[TERCA]",
      });
      expect(result).toEqual({
        ...oficinaExistente,
        ...dadosParaAtualizar
      });
    });

    it("deve lançar erro 404 se oficina não existir para atualizar", async () => {
      OficinaModel.getById.mockResolvedValue(null);

      await expect(
        OficinaService.updateOficina(999, { nome: "Novo Nome" })
      ).rejects.toMatchObject({
        message: "Oficina não encontrada para atualização.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("deleteOficina", () => {
    it("deve deletar oficina existente", async () => {
      const oficinaExistente = { id: 1, nome: "Oficina 1" };
      OficinaModel.getById.mockResolvedValue(oficinaExistente);
      OficinaModel.delete.mockResolvedValue(true);

      const result = await OficinaService.deleteOficina(1);

      expect(OficinaModel.getById).toHaveBeenCalledWith(1);
      expect(OficinaModel.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("deve lançar erro 404 se oficina não existir para exclusão", async () => {
      OficinaModel.getById.mockResolvedValue(null);

      await expect(OficinaService.deleteOficina(999)).rejects.toMatchObject({
        message: "Oficina não encontrada para exclusão.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });
});
