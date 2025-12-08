var express = require("express");
var router = express.Router();

var reclamacaoController = require("../controllers/reclamacaoController");
var comentarioController = require("../controllers/comentarioController");

// ==================== ROTAS DE RECLAMAÇÕES ====================

// LISTAR todas as reclamações
router.get("/", function (req, res) {
    reclamacaoController.listarTodas(req, res);
});

// BUSCAR reclamações por termo
router.get("/buscar", function (req, res) {
    reclamacaoController.buscar(req, res);
});

// OBTER estatísticas
router.get("/estatisticas", function (req, res) {
    reclamacaoController.obterEstatisticas(req, res);
});

// LISTAR veículos disponíveis
router.get("/veiculos", function (req, res) {
    reclamacaoController.listarVeiculos(req, res);
});

// LISTAR locais de embarque disponíveis
router.get("/locais", function (req, res) {
    reclamacaoController.listarLocais(req, res);
});

// OBTER uma reclamação específica por ID
router.get("/:id", function (req, res) {
    reclamacaoController.listarPorId(req, res);
});

// CRIAR nova reclamação
router.post("/", function (req, res) {
    reclamacaoController.criar(req, res);
});

// ATUALIZAR reclamação completa
router.put("/:id", function (req, res) {
    reclamacaoController.atualizar(req, res);
});

// ATUALIZAR apenas o status da reclamação
router.put("/:id/status", function (req, res) {
    reclamacaoController.atualizarStatus(req, res);
});

// DELETAR reclamação
router.delete("/:id", function (req, res) {
    reclamacaoController.deletar(req, res);
});

// ==================== ROTAS DE COMENTÁRIOS ====================

// LISTAR comentários de uma reclamação
router.get("/:id/comentarios", function (req, res) {
    comentarioController.listar(req, res);
});

// CRIAR novo comentário
router.post("/:id/comentarios", function (req, res) {
    comentarioController.criar(req, res);
});

// ATUALIZAR comentário existente
router.put("/comentarios/:id", function (req, res) {
    comentarioController.atualizar(req, res);
});

// DELETAR comentário
router.delete("/comentarios/:id", function (req, res) {
    comentarioController.deletar(req, res);
});

module.exports = router;