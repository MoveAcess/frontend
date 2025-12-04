var express = require("express");
var router = express.Router();

var reclamacaoUserController = require("../controllers/reclamacaoUserController");

// ======================= CADASTRAR ==========================

// ======================= LISTAR ==========================
router.get("/listar", function (req, res) {
    console.log("📩 Requisição recebida: GET /reclamacaoUser/listar");
    reclamacaoUserController.listarReclamacoesUser(req, res);
});

// ======================= EDITAR STATUS ==========================
router.put("/editar/:idReclamacao", function (req, res) {
    console.log("📩 Requisição recebida: PUT /reclamacaoUser/editar/" + req.params.idReclamacao);
    reclamacaoUserController.editarReclamacaoUser(req, res);
});

// ======================= DELETAR ==========================
router.delete("/deletar/:idReclamacao", function (req, res) {
    console.log("📩 Requisição recebida: DELETE /reclamacaoUser/deletar/" + req.params.idReclamacao);
    reclamacaoUserController.deletarReclamacaoUser(req, res);
});

module.exports = router;
