var express = require("express");
var router = express.Router();

var reclamacaoUserController = require("../controllers/reclamacaoUserController");

// listar por usuário
router.get("/:idUsuario", function (req, res) {
    reclamacaoUserController.listarPorUsuario(req, res);
});

// cadastrar
router.post("/cadastrar", function (req, res) {
    reclamacaoUserController.cadastrar(req, res);
});

// editar
router.put("/:idReclamacao", function (req, res) {
    reclamacaoUserController.editar(req, res);
});

// excluir
router.delete("/:idReclamacao", function (req, res) {
    reclamacaoUserController.deletar(req, res);
});

module.exports = router;
