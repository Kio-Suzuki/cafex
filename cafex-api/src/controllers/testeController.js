import testeService from "../services/testeService.js";

export default class testeController extends testeService {
  static getTxtBotaoController = async (req, res) => {
    const txtBotao = await testeController.getTxtBotaoService();
    return res.status(200).json(txtBotao);
  };
}
