var reclamacaoUserModel = require("../models/reclamacaoUserModel");

// ======================= CADASTRAR ==========================
function cadastrarReclamacaoUser(req, res) {
    const fkUsuario = req.params.idUsuario;
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const local = req.body.local;
    const veiculo = req.body.veiculo;

    // Validação básica
    if (!fkUsuario || !titulo || !descricao || !local || !veiculo) {
        return res.status(400).json({ error: "Dados incompletos para cadastro." });
    }
    reclamacaoUserModel
        .cadastrarReclamacaoUser(fkUsuario, titulo, descricao, local, veiculo)
        .then(resultado => res.status(201).json(resultado))
        .catch(erro => {
            console.error("❌ Erro ao cadastrar reclamação:", erro.sqlMessage || erro);
            res.status(500).json({ error: "Erro ao cadastrar reclamação." });
        });
}

// ======================= LISTAR ==========================
function listarReclamacoesUser(req, res) {
    const idUsuario = req.params.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ error: "É necessário informar o idUsuario." });
    }

    reclamacaoUserModel
        .listarReclamacoesUser(idUsuario)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("❌ Erro ao listar reclamações:", erro.sqlMessage || erro);
            res.status(500).json({ error: "Erro ao listar reclamações." });
        });
}

// ======================= EDITAR STATUS ==========================
function editarReclamacaoUser(req, res) {
    const idReclamacao = req.params.idReclamacao;
    const novoStatus = req.body.statusReclamacao;

    if (!idReclamacao || !novoStatus) {
        return res.status(400).json({ error: "Dados incompletos para edição." });
    }

    reclamacaoUserModel
        .editarReclamacaoUser(idReclamacao, novoStatus)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("❌ Erro ao editar reclamação:", erro.sqlMessage || erro);
            res.status(500).json({ error: "Erro ao editar reclamação." });
        });
}

// ======================= DELETAR ==========================
function deletarReclamacaoUser(req, res) {
    const idReclamacao = req.params.idReclamacao;

    if (!idReclamacao) {
        return res.status(400).json({ error: "ID da reclamação não informado." });
    }

    reclamacaoUserModel
        .deletarReclamacaoUser(idReclamacao)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("❌ Erro ao deletar reclamação:", erro.sqlMessage || erro);
            res.status(500).json({ error: "Erro ao deletar reclamação." });
        });
}

module.exports = {
    cadastrarReclamacaoUser,
    listarReclamacoesUser,
    editarReclamacaoUser,
    deletarReclamacaoUser
};
