var reclamacaoUser = require("../models/reclamacaoUserModel");

function cadastrarReclamacaoUser(req, res) {
    var idUsuario = req.body.idUsuario;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var dataReclamacao = new Date().toISOString().slice(0, 19).replace('T', ' ');
    reclamacaoUser.cadastrarReclamacaoUser(idUsuario, titulo, descricao, dataReclamacao)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.error(erro);
            res.status(500).json({ error: "Erro ao cadastrar reclamação." });
        });
}   

function listarReclamacoesUser(req, res) {
    var idUsuario = req.query.idUsuario;
    reclamacaoUser.listarReclamacoesUser(idUsuario)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.error(erro);
            res.status(500).json({ error: "Erro ao listar reclamações." });
        });
}

function editarReclamacaoUser(req, res) {
    var idReclamacao = req.params.idReclamacao;
    var novoStatus = req.body.status;
    reclamacaoUser.editarReclamacaoUser(idReclamacao, novoStatus)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.error(erro);
            res.status(500).json({ error: "Erro ao editar reclamação." });
        });
}

function deletarReclamacaoUser(req, res) {
    var idReclamacao = req.params.idReclamacao;
    reclamacaoUser.deletarReclamacaoUser(idReclamacao)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.error(erro);
            res.status(500).json({ error: "Erro ao deletar reclamação." });
        });
}

module.exports = {
    cadastrarReclamacaoUser,
    listarReclamacoesUser,
    editarReclamacaoUser,
    deletarReclamacaoUser
}