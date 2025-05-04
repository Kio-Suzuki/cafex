export default class testeService{
    static getTxtBotaoService = async (req, res) => {
        const txtBotao = 'Clicou no Botao';
        return res.status(200).json(txtBotao);
    };
}