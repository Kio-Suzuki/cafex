import { jest } from '@jest/globals';

await jest.unstable_mockModule('../src/models/presencaModel.js', () => ({
  default: {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

await jest.unstable_mockModule('../src/models/oficinaModel.js', () => ({
  default: {
    getById: jest.fn(),
  },
}));

await jest.unstable_mockModule('../src/models/alunoModel.js', () => ({
  default: {
    getByRa: jest.fn(),
  },
}));

await jest.unstable_mockModule('../src/logs/logError.js', () => ({
  default: jest.fn(),
}));

const { default: PresencaModel } = await import('../src/models/presencaModel.js');
const { default: OficinaModel } = await import('../src/models/oficinaModel.js');
const { default: AlunoModel } = await import('../src/models/alunoModel.js');
const logError = (await import('../src/logs/logError.js')).default;
const { default: PresencaService } = await import('../src/services/presencaService.js');

describe("PresencaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateFields", () => {
    it("deve lançar erro se algum campo obrigatório estiver faltando", () => {
      const data = {
        dataPresenca: "2025-06-01",
        status: "presente",
        alunoRa: 123,
      };
      expect(() => PresencaService.validateFields(data)).toThrow(
        'Campo obrigatório "oficinaId" não foi preenchido.'
      );
    });

    it("deve lançar erro se dataPresenca for string inválida", () => {
      const data = {
        dataPresenca: "data-invalida",
        status: "presente",
        alunoRa: 123,
        oficinaId: 1,
      };
      expect(() => PresencaService.validateFields(data)).toThrow(
        'Formato de "dataPresenca" inválido.'
      );
    });

    it("deve converter dataPresenca string para Date", () => {
      const data = {
        dataPresenca: "2025-06-01",
        status: "presente",
        alunoRa: 123,
        oficinaId: 1,
      };
      PresencaService.validateFields(data);
      expect(data.dataPresenca).toBeInstanceOf(Date);
    });

    it("não deve lançar erro se todos os campos estiverem corretos", () => {
      const data = {
        dataPresenca: new Date(),
        status: "presente",
        alunoRa: 123,
        oficinaId: 1,
      };
      expect(() => PresencaService.validateFields(data)).not.toThrow();
    });
  });

  describe("createPresenca", () => {
    it("deve criar presença com dados válidos", async () => {
      const data = {
        dataPresenca: "2025-06-01",
        status: "presente",
        alunoRa: "123",
        oficinaId: "1",
      };

      const oficina = { id: 1, nome: "Oficina 1" };
      const aluno = { ra: 123, nome: "Aluno 1" };
      const created = { ...data, alunoRa: 123, oficinaId: 1, dataPresenca: new Date(data.dataPresenca) };

      OficinaModel.getById.mockResolvedValue(oficina);
      AlunoModel.getByRa.mockResolvedValue(aluno);
      PresencaModel.create.mockResolvedValue(created);

      const result = await PresencaService.createPresenca(data);

      expect(OficinaModel.getById).toHaveBeenCalledWith(1);
      expect(AlunoModel.getByRa).toHaveBeenCalledWith(123);
      expect(PresencaModel.create).toHaveBeenCalledWith({
        ...data,
        alunoRa: 123,
        oficinaId: 1,
        dataPresenca: new Date(data.dataPresenca),
      });
      expect(result).toEqual(created);
    });

    it("deve lançar erro se oficina não encontrada", async () => {
      OficinaModel.getById.mockResolvedValue(null);
      const data = {
        dataPresenca: "2025-06-01",
        status: "presente",
        alunoRa: "123",
        oficinaId: "1",
      };

      await expect(PresencaService.createPresenca(data)).rejects.toThrow("Oficina não encontrada.");
      expect(logError).toHaveBeenCalled();
    });

    it("deve lançar erro se aluno não encontrado", async () => {
      OficinaModel.getById.mockResolvedValue({ id: 1 });
      AlunoModel.getByRa.mockResolvedValue(null);
      const data = {
        dataPresenca: "2025-06-01",
        status: "presente",
        alunoRa: "123",
        oficinaId: "1",
      };

      await expect(PresencaService.createPresenca(data)).rejects.toThrow("Aluno não encontrado.");
      expect(logError).toHaveBeenCalled();
    });

    it("deve logar e lançar erro se validar campos falhar", async () => {
      const data = {
        status: "presente",
        alunoRa: "123",
        oficinaId: "1",
      };

      await expect(PresencaService.createPresenca(data)).rejects.toThrow(
        'Campo obrigatório "dataPresenca" não foi preenchido.'
      );
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("getAllPresencas", () => {
    it("deve retornar todas as presenças sem filtro", async () => {
      const presencas = [{ id: 1 }, { id: 2 }];
      PresencaModel.getAll.mockResolvedValue(presencas);

      const result = await PresencaService.getAllPresencas({});

      expect(PresencaModel.getAll).toHaveBeenCalledWith({});
      expect(result).toEqual(presencas);
    });

    it("deve aplicar filtros corretamente", async () => {
      const filter = {
        alunoRa: "123",
        oficinaId: "1",
        dataInicio: "2025-06-01",
        dataFim: "2025-06-10",
      };

      const expectedWhere = {
        alunoRa: 123,
        oficinaId: 1,
        dataPresenca: {
          gte: new Date(filter.dataInicio),
          lte: new Date(filter.dataFim),
        },
      };

      const presencas = [{ id: 1 }];
      PresencaModel.getAll.mockResolvedValue(presencas);

      const result = await PresencaService.getAllPresencas(filter);

      expect(PresencaModel.getAll).toHaveBeenCalledWith(expectedWhere);
      expect(result).toEqual(presencas);
    });

    it("deve logar e lançar erro se getAll falhar", async () => {
      const error = new Error("Erro genérico");
      PresencaModel.getAll.mockRejectedValue(error);

      await expect(PresencaService.getAllPresencas({})).rejects.toThrow(error);
      expect(logError).toHaveBeenCalledWith(error);
    });
  });

  describe("getPresencaById", () => {
    it("deve retornar presença existente", async () => {
      const presenca = { id: 1 };
      PresencaModel.getById.mockResolvedValue(presenca);

      const result = await PresencaService.getPresencaById(1);

      expect(PresencaModel.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(presenca);
    });

    it("deve lançar erro 404 se presença não encontrada", async () => {
      PresencaModel.getById.mockResolvedValue(null);

      await expect(PresencaService.getPresencaById(999)).rejects.toMatchObject({
        message: "Presenca não encontrada.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("updatePresenca", () => {
    it("deve atualizar presença com dataPresenca string válida", async () => {
      const presencaExistente = { id: 1 };
      const dataParaAtualizar = { dataPresenca: "2025-06-01", status: "ausente" };

      PresencaModel.getById.mockResolvedValue(presencaExistente);
      PresencaModel.update.mockResolvedValue({
        ...presencaExistente,
        ...dataParaAtualizar,
        dataPresenca: new Date(dataParaAtualizar.dataPresenca),
      });

      const result = await PresencaService.updatePresenca(1, dataParaAtualizar);

      expect(PresencaModel.getById).toHaveBeenCalledWith(1);
      expect(PresencaModel.update).toHaveBeenCalledWith(1, {
        ...dataParaAtualizar,
        dataPresenca: new Date(dataParaAtualizar.dataPresenca),
      });
      expect(result).toEqual({
        ...presencaExistente,
        ...dataParaAtualizar,
        dataPresenca: new Date(dataParaAtualizar.dataPresenca),
      });
    });

    it("deve lançar erro 404 se presença não encontrada para atualizar", async () => {
      PresencaModel.getById.mockResolvedValue(null);

      await expect(PresencaService.updatePresenca(999, { status: "presente" })).rejects.toMatchObject({
        message: "Presenca não encontrada para atualização.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });

    it("deve lançar erro se dataPresenca inválida na atualização", async () => {
      const presencaExistente = { id: 1 };
      PresencaModel.getById.mockResolvedValue(presencaExistente);

      await expect(
        PresencaService.updatePresenca(1, { dataPresenca: "data-invalida" })
      ).rejects.toMatchObject({
        message: 'Formato de "dataPresenca" inválido.',
        statusCode: 400,
      });
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("deletePresenca", () => {
    it("deve deletar presença existente", async () => {
      const presencaExistente = { id: 1 };
      PresencaModel.getById.mockResolvedValue(presencaExistente);
      PresencaModel.delete.mockResolvedValue(true);

      const result = await PresencaService.deletePresenca(1);

      expect(PresencaModel.getById).toHaveBeenCalledWith(1);
      expect(PresencaModel.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("deve lançar erro 404 se presença não encontrada para exclusão", async () => {
      PresencaModel.getById.mockResolvedValue(null);

      await expect(PresencaService.deletePresenca(999)).rejects.toMatchObject({
        message: "Presenca não encontrada para exclusão.",
        statusCode: 404,
      });
      expect(logError).toHaveBeenCalled();
    });
  });
});
