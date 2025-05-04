import testeService from '../src/services/testeService.js';

describe('testeService', () => {
  it('deve retornar "Clicou no Botao"', async () => {
    const resultado = await testeService.getTxtBotaoService();
    expect(resultado).toBe("Clicou no Botao");
  });
});
