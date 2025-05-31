import { jest } from '@jest/globals';

await jest.unstable_mockModule("../src/models/alunoModel.js", () => ({
  default: {
    create: jest.fn(),
    getAll: jest.fn(),
    getByRa: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

await jest.unstable_mockModule("../src/logs/logError.js", () => ({
  default: jest.fn(),
}));

const { default: AlunoModel } = await import("../src/models/alunoModel.js");
const logError = (await import("../src/logs/logError.js")).default;
const { default: AlunoService } = await import("../src/services/alunoService.js");

describe("AlunoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateFields", () => {
    it("deve lançar erro se campo obrigatório não for preenchido", () => {
      const data = { ra: "12345" };
      expect(() => AlunoService.validateFields(data)).toThrow(
        'Campo obrigatório "nome" não foi preenchido.'
      );
    });

    it("não deve lançar erro se todos os campos obrigatórios estiverem preenchidos", () => {
      const data = { ra: "12345", nome: "João" };
      expect(() => AlunoService.validateFields(data)).not.toThrow();
    });
  });

  describe("createAluno", () => {
    it("deve criar um aluno com dados válidos", async () => {
      const data = { ra: "12345", nome: "João" };
      AlunoModel.create.mockResolvedValue(data);

      const result = await AlunoService.createAluno(data);

      expect(AlunoModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it("deve logar e lançar erro se dados inválidos", async () => {
      const data = { ra: "12345" };

      await expect(AlunoService.createAluno(data)).rejects.toThrow(
        'Campo obrigatório "nome" não foi preenchido.'
      );
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("getAllAlunos", () => {
    it("deve retornar todos os alunos", async () => {
      const alunos = [
        { ra: "1", nome: "A" },
        { ra: "2", nome: "B" },
      ];
      AlunoModel.getAll.mockResolvedValue(alunos);

      const result = await AlunoService.getAllAlunos();

      expect(AlunoModel.getAll).toHaveBeenCalled();
      expect(result).toEqual(alunos);
    });

    it("deve logar e lançar erro se ocorrer erro", async () => {
      const error = new Error("Erro genérico");
      AlunoModel.getAll.mockRejectedValue(error);

      await expect(AlunoService.getAllAlunos()).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("getAlunoByRa", () => {
    it("deve retornar aluno existente", async () => {
      const aluno = { ra: "123", nome: "Maria" };
      AlunoModel.getByRa.mockResolvedValue(aluno);

      const result = await AlunoService.getAlunoByRa("123");

      expect(AlunoModel.getByRa).toHaveBeenCalledWith("123");
      expect(result).toEqual(aluno);
    });

    it("deve lançar erro 404 se aluno não for encontrado", async () => {
      AlunoModel.getByRa.mockResolvedValue(null);

      await expect(AlunoService.getAlunoByRa("999")).rejects.toMatchObject({
        message: "Aluno não encontrado.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("updateAluno", () => {
    it("deve atualizar aluno existente", async () => {
      const aluno = { ra: "123", nome: "Maria" };
      const dataUpdate = { nome: "Maria Atualizada" };
      AlunoModel.getByRa.mockResolvedValue(aluno);
      AlunoModel.update.mockResolvedValue({ ...aluno, ...dataUpdate });

      const result = await AlunoService.updateAluno("123", dataUpdate);

      expect(AlunoModel.getByRa).toHaveBeenCalledWith("123");
      expect(AlunoModel.update).toHaveBeenCalledWith("123", dataUpdate);
      expect(result).toEqual({ ...aluno, ...dataUpdate });
    });

    it("deve lançar erro 404 se aluno não for encontrado para atualização", async () => {
      AlunoModel.getByRa.mockResolvedValue(null);

      await expect(
        AlunoService.updateAluno("999", { nome: "Novo Nome" })
      ).rejects.toMatchObject({
        message: "Aluno não encontrado para atualização.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("deleteAluno", () => {
    it("deve deletar aluno existente", async () => {
      const aluno = { ra: "123", nome: "Maria" };
      AlunoModel.getByRa.mockResolvedValue(aluno);
      AlunoModel.delete.mockResolvedValue(true);

      const result = await AlunoService.deleteAluno("123");

      expect(AlunoModel.getByRa).toHaveBeenCalledWith("123");
      expect(AlunoModel.delete).toHaveBeenCalledWith("123");
      expect(result).toBe(true);
    });

    it("deve lançar erro 404 se aluno não for encontrado para exclusão", async () => {
      AlunoModel.getByRa.mockResolvedValue(null);

      await expect(AlunoService.deleteAluno("999")).rejects.toMatchObject({
        message: "Aluno não encontrado para exclusão.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });
});
