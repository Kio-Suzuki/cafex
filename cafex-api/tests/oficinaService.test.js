import OficinaService from "../src/services/oficinaService.js";
import OficinaModel from "../src/models/oficinaModel.js";
import { logError } from "../src/logs/logError.js";

jest.mock("../src/models/oficinaModel.js");
jest.mock("../src/logs/logError.js");

describe("OficinaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOficina", () => {
    it("deve criar oficina com dados válidos e datas em string", async () => {
      const dados = {
        nome: "Oficina Teste",
        horarioInicio: "2025-06-01T10:00:00Z",
        horarioFim: "2025-06-01T12:00:00Z",
      };
      const created = {
        ...dados,
        horarioInicio: new Date(dados.horarioInicio),
        horarioFim: new Date(dados.horarioFim),
      };
      OficinaModel.create.mockResolvedValue(created);

      const result = await OficinaService.createOficina(dados);

      expect(OficinaModel.create).toHaveBeenCalledWith({
        nome: "Oficina Teste",
        horarioInicio: new Date(dados.horarioInicio),
        horarioFim: new Date(dados.horarioFim),
      });
      expect(result).toEqual(created);
    });

    it("deve criar oficina com datas já em Date", async () => {
      const dados = {
        nome: "Oficina Teste",
        horarioInicio: new Date("2025-06-01T10:00:00Z"),
        horarioFim: new Date("2025-06-01T12:00:00Z"),
      };
      OficinaModel.create.mockResolvedValue(dados);

      const result = await OficinaService.createOficina(dados);

      expect(OficinaModel.create).toHaveBeenCalledWith(dados);
      expect(result).toEqual(dados);
    });

    it("deve lançar erro se campos obrigatórios faltarem", async () => {
      const dados = {
        nome: "Oficina Teste",
        horarioInicio: "2025-06-01T10:00:00Z",
      };

      await expect(OficinaService.createOficina(dados)).rejects.toMatchObject({
        message:
          'Os campos "nome", "horarioInicio" e "horarioFim" são obrigatórios.',
        statusCode: 400,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve lançar erro se horarioInicio for string inválida", async () => {
      const dados = {
        nome: "Oficina Teste",
        horarioInicio: "data-invalida",
        horarioFim: "2025-06-01T12:00:00Z",
      };

      await expect(OficinaService.createOficina(dados)).rejects.toMatchObject({
        message: 'Formato de "horarioInicio" inválido.',
        statusCode: 400,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve lançar erro se horarioFim for string inválida", async () => {
      const dados = {
        nome: "Oficina Teste",
        horarioInicio: "2025-06-01T10:00:00Z",
        horarioFim: "data-invalida",
      };

      await expect(OficinaService.createOficina(dados)).rejects.toMatchObject({
        message: 'Formato de "horarioFim" inválido.',
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
        horarioInicio: "2025-06-01T09:00:00Z",
        horarioFim: "2025-06-01T11:00:00Z",
      };
      OficinaModel.getById.mockResolvedValue(oficinaExistente);
      OficinaModel.update.mockResolvedValue({
        ...oficinaExistente,
        ...dadosParaAtualizar,
        horarioInicio: new Date(dadosParaAtualizar.horarioInicio),
        horarioFim: new Date(dadosParaAtualizar.horarioFim),
      });

      const result = await OficinaService.updateOficina(1, dadosParaAtualizar);

      expect(OficinaModel.getById).toHaveBeenCalledWith(1);
      expect(OficinaModel.update).toHaveBeenCalledWith(1, {
        nome: "Oficina Atualizada",
        horarioInicio: new Date(dadosParaAtualizar.horarioInicio),
        horarioFim: new Date(dadosParaAtualizar.horarioFim),
      });
      expect(result).toEqual({
        ...oficinaExistente,
        ...dadosParaAtualizar,
        horarioInicio: new Date(dadosParaAtualizar.horarioInicio),
        horarioFim: new Date(dadosParaAtualizar.horarioFim),
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

    it("deve lançar erro se horarioInicio inválido na atualização", async () => {
      const oficinaExistente = { id: 1, nome: "Oficina 1" };
      OficinaModel.getById.mockResolvedValue(oficinaExistente);

      await expect(
        OficinaService.updateOficina(1, { horarioInicio: "data-invalida" })
      ).rejects.toMatchObject({
        message: 'Formato de "horarioInicio" inválido.',
        statusCode: 400,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve lançar erro se horarioFim inválido na atualização", async () => {
      const oficinaExistente = { id: 1, nome: "Oficina 1" };
      OficinaModel.getById.mockResolvedValue(oficinaExistente);

      await expect(
        OficinaService.updateOficina(1, { horarioFim: "data-invalida" })
      ).rejects.toMatchObject({
        message: 'Formato de "horarioFim" inválido.',
        statusCode: 400,
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
