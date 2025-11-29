var express = require("express");
var router = express.Router();

var reclamacaoUserController = require("../controllers/reclamacaoUserController");

router.post("/cadastrar", function (req, res) {
    reclamacaoUserController.cadastrarReclamacaoUser(req, res);
});

router.get("/listar", function (req, res) {
    reclamacaoUserController.listarReclamacoesUser(req, res);
});

router.put("/editar/:idReclamacao", function (req, res) {
    reclamacaoUserController.editarReclamacaoUser(req, res);
});

router.delete("/deletar/:idReclamacao", function (req, res) {
    reclamacaoUserController.deletarReclamacaoUser(req, res);
});

module.exports = router;