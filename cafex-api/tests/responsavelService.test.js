import ResponsavelService from "../src/services/responsavelService.js";
import ResponsavelModel from "../src/models/responsavelModel.js";
import { logError } from "../src/logs/logError.js";

jest.mock("../src/models/responsavelModel.js");
jest.mock("../src/logs/logError.js");

describe("ResponsavelService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateFields", () => {
    it("deve lançar erro se 'nomeResponsavel' não for preenchido", () => {
      const data = { registroResponsavel: "12345" };
      expect(() => ResponsavelService.validateFields(data)).toThrow(
        'Campo obrigatório "nomeResponsavel" não foi preenchido.'
      );
    });

    it("deve lançar erro se 'registroResponsavel' não for preenchido", () => {
      const data = { nomeResponsavel: "Maria" };
      expect(() => ResponsavelService.validateFields(data)).toThrow(
        'Campo obrigatório "registroResponsavel" não foi preenchido.'
      );
    });

    it("não deve lançar erro se todos os campos obrigatórios estiverem preenchidos", () => {
      const data = { nomeResponsavel: "Maria", registroResponsavel: "12345" };
      expect(() => ResponsavelService.validateFields(data)).not.toThrow();
    });
  });

  describe("create", () => {
    it("deve criar responsável com dados válidos", async () => {
      const data = { nomeResponsavel: "Maria", registroResponsavel: "12345" };
      ResponsavelModel.create.mockResolvedValue(data);

      const result = await ResponsavelService.create(data);

      expect(ResponsavelModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it("deve logar e lançar erro se dados inválidos (validação)", async () => {
      const data = { registroResponsavel: "12345" };

      await expect(ResponsavelService.create(data)).rejects.toThrow(
        'Campo obrigatório "nomeResponsavel" não foi preenchido.'
      );
      expect(logError).toHaveBeenCalled();
    });

    it("deve logar e lançar erro se create do model falhar", async () => {
      const data = { nomeResponsavel: "Maria", registroResponsavel: "12345" };
      const error = new Error("Erro no banco");
      ResponsavelModel.create.mockRejectedValue(error);

      await expect(ResponsavelService.create(data)).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("deve retornar todos os responsáveis", async () => {
      const responsaveis = [{ id: 1 }, { id: 2 }];
      ResponsavelModel.findAll.mockResolvedValue(responsaveis);

      const result = await ResponsavelService.getAll();

      expect(ResponsavelModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(responsaveis);
    });

    it("deve logar e lançar erro se findAll falhar", async () => {
      const error = new Error("Erro genérico");
      ResponsavelModel.findAll.mockRejectedValue(error);

      await expect(ResponsavelService.getAll()).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("getById", () => {
    it("deve retornar responsável existente", async () => {
      const responsavel = { id: 1, nomeResponsavel: "Maria" };
      ResponsavelModel.findById.mockResolvedValue(responsavel);

      const result = await ResponsavelService.getById(1);

      expect(ResponsavelModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(responsavel);
    });

    it("deve lançar erro 404 se responsável não encontrado", async () => {
      ResponsavelModel.findById.mockResolvedValue(null);

      await expect(ResponsavelService.getById(999)).rejects.toMatchObject({
        message: "Responsável não encontrado.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve logar e lançar erro se findById falhar", async () => {
      const error = new Error("Erro genérico");
      ResponsavelModel.findById.mockRejectedValue(error);

      await expect(ResponsavelService.getById(1)).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("deve atualizar responsável existente", async () => {
      const responsavel = { id: 1, nomeResponsavel: "Maria" };
      const dataUpdate = { registroResponsavel: "54321" };
      ResponsavelModel.findById.mockResolvedValue(responsavel);
      ResponsavelModel.update.mockResolvedValue({ ...responsavel, ...dataUpdate });

      const result = await ResponsavelService.update(1, dataUpdate);

      expect(ResponsavelModel.findById).toHaveBeenCalledWith(1);
      expect(ResponsavelModel.update).toHaveBeenCalledWith(1, dataUpdate);
      expect(result).toEqual({ ...responsavel, ...dataUpdate });
    });

    it("deve lançar erro 404 se responsável não encontrado para atualização", async () => {
      ResponsavelModel.findById.mockResolvedValue(null);

      await expect(ResponsavelService.update(999, { registroResponsavel: "54321" })).rejects.toMatchObject({
        message: "Responsável não encontrado para atualização.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve logar e lançar erro se update falhar", async () => {
      const responsavel = { id: 1, nomeResponsavel: "Maria" };
      ResponsavelModel.findById.mockResolvedValue(responsavel);
      const error = new Error("Erro no update");
      ResponsavelModel.update.mockRejectedValue(error);

      await expect(ResponsavelService.update(1, { registroResponsavel: "54321" })).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("deve deletar responsável existente", async () => {
      const responsavel = { id: 1 };
      ResponsavelModel.findById.mockResolvedValue(responsavel);
      ResponsavelModel.delete.mockResolvedValue(true);

      const result = await ResponsavelService.delete(1);

      expect(ResponsavelModel.findById).toHaveBeenCalledWith(1);
      expect(ResponsavelModel.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("deve lançar erro 404 se responsável não encontrado para exclusão", async () => {
      ResponsavelModel.findById.mockResolvedValue(null);

      await expect(ResponsavelService.delete(999)).rejects.toMatchObject({
        message: "Responsável não encontrado para exclusão.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve logar e lançar erro se delete falhar", async () => {
      const responsavel = { id: 1 };
      ResponsavelModel.findById.mockResolvedValue(responsavel);
      const error = new Error("Erro no delete");
      ResponsavelModel.delete.mockRejectedValue(error);

      await expect(ResponsavelService.delete(1)).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });
});