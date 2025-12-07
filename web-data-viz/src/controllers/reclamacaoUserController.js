var reclamacaoUserModel = require("../models/reclamacaoUserModel");

function listarPorUsuario(req, res) {
    const id = req.params.idUsuario;

    reclamacaoUserModel.listarPorUsuario(id)
        .then(resultado => res.status(200).json(resultado))
        .catch(err => {
            console.error("Erro ao listar:", err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        });
}

async function filtrar(req, res){
    const idUsuario = req.params.idUsuario;
    const filtros = req.query;

    try {
        const resultado = await reclamacaoUserModel.filtrarReclamacoes(idUsuario, filtros);
        res.status(200).json(resultado);
    }catch(error){
        res.status(500).json({ error: "Erro ao filtrar reclamações" });
    }
}

function cadastrar(req, res) {
    const { tipo, descricao, fkUsuario, fkVeiculo, fkLocal } = req.body;

    if (!fkVeiculo && !fkLocal) {
        return res.status(400).send("É necessário informar ou veículo ou local de embarque.");
    }

    reclamacaoUserModel.cadastrar(tipo, descricao, fkUsuario, fkVeiculo, fkLocal)
        .then(() => res.status(201).send("Reclamação registrada!"))
        .catch(err => {
            console.error("Erro ao cadastrar:", err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        });
}

function deletar(req, res) {
    const id = req.params.idReclamacao;

    reclamacaoUserModel.deletar(id)
        .then(() => res.status(200).send("Reclamação excluída"))
        .catch(err => {
            console.error("Erro ao excluir:", err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        });
}

function editar(req, res) {
    const { tipo, descricao, status } = req.body;
    const id = req.params.idReclamacao;

    reclamacaoUserModel.editar(id, tipo, descricao, status)
        .then(() => res.status(200).send("Reclamação atualizada"))
        .catch(err => {
            console.error("Erro ao editar:", err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        });
}

module.exports = {
    listarPorUsuario,
    filtrar,
    cadastrar,
    deletar,
    editar
};
