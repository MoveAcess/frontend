var reclamacaoModel = require("../models/reclamacaoModel");
var comentarioModel = require("../models/comentarioModel");

// ==================== LISTAR ====================
function listarTodas(req, res) {
    // Se tiver idUsuario no query, filtra por usuário
    var idUsuario = req.query.idUsuario;
    
    if (idUsuario) {
        // Filtrar por usuário específico
        reclamacaoModel.listarPorUsuario(idUsuario)
            .then(resultado => res.json(resultado))
            .catch(erro => {
                console.log("Erro ao listar reclamações por usuário:", erro.sqlMessage);
                res.status(500).json({ erro: erro.sqlMessage });
            });
    } else {
        // Listar TODAS (para admins)
        reclamacaoModel.listarTodas()
            .then(resultado => res.json(resultado))
            .catch(erro => {
                console.log("Erro ao listar todas reclamações:", erro.sqlMessage);
                res.status(500).json({ erro: erro.sqlMessage });
            });
    }
}

function listarPorId(req, res) {
    var id = req.params.id;
    reclamacaoModel.listarPorId(id)
        .then(async resultado => {
            if (resultado.length === 0) {
                res.status(404).json({ erro: "Reclamação não encontrada." });
                return;
            }
            // Buscar comentários relacionados
            const comentarios = await comentarioModel.listarComentariosDaReclamacao(id);
            resultado[0].comentarios = comentarios;
            res.json(resultado[0]);
        })
        .catch(erro => {
            console.log("Erro ao buscar reclamação:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// ==================== CRIAR ====================
function criar(req, res) {
    var { tipo, descricao, fkVeiculo, fkLocalEmbarque, fkUsuario, statusReclamacao } = req.body;
    
    // Validações
    if (!tipo || !descricao || !fkUsuario) {
        res.status(400).json({ erro: "Campos obrigatórios: tipo, descricao, fkUsuario" });
        return;
    }
    
    // Validar se ao menos um (veículo ou local) foi informado
    if (!fkVeiculo && !fkLocalEmbarque) {
        res.status(400).json({ erro: "Informe ao menos um: fkVeiculo ou fkLocalEmbarque" });
        return;
    }
    
    reclamacaoModel.criar(
        statusReclamacao,
        tipo,
        descricao,
        fkVeiculo,
        fkLocalEmbarque,
        fkUsuario
    )
        .then(resultado => {
            res.status(201).json({
                mensagem: "Reclamação criada com sucesso!",
                idReclamacao: resultado.insertId
            });
        })
        .catch(erro => {
            console.log("Erro ao criar reclamação:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// ==================== ATUALIZAR ====================
function atualizar(req, res) {
    var id = req.params.id;
    var { tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao } = req.body;
    
    // Validações
    if (!tipo || !descricao || !statusReclamacao) {
        res.status(400).json({ erro: "Campos obrigatórios: tipo, descricao, statusReclamacao" });
        return;
    }
    
    // Validar se ao menos um (veículo ou local) foi informado
    if (!fkVeiculo && !fkLocalEmbarque) {
        res.status(400).json({ erro: "Informe ao menos um: fkVeiculo ou fkLocalEmbarque" });
        return;
    }
    
    reclamacaoModel.atualizar(id, tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao)
        .then(resultado => {
            if (resultado.affectedRows === 0) {
                res.status(404).json({ erro: "Reclamação não encontrada." });
                return;
            }
            res.json({ mensagem: "Reclamação atualizada com sucesso!" });
        })
        .catch(erro => {
            console.log("Erro ao atualizar reclamação:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function atualizarStatus(req, res) {
    var id = req.params.id;
    var novoStatus = req.body.status;
    
    if (!novoStatus) {
        res.status(400).json({ erro: "Status não enviado!" });
        return;
    }
    
    // Validar status
    var statusValidos = ['Pendente', 'Em andamento', 'Resolvido'];
    if (!statusValidos.includes(novoStatus)) {
        res.status(400).json({ erro: "Status inválido. Use: Pendente, Em andamento ou Resolvido" });
        return;
    }
    
    reclamacaoModel.atualizarStatus(id, novoStatus)
        .then(resultado => {
            if (resultado.affectedRows === 0) {
                res.status(404).json({ erro: "Reclamação não encontrada." });
                return;
            }
            res.json({ mensagem: "Status atualizado com sucesso!" });
        })
        .catch(erro => {
            console.log("Erro ao atualizar status:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// ==================== DELETAR ====================
function deletar(req, res) {
    var id = req.params.id;
    
    reclamacaoModel.deletar(id)
        .then(resultado => {
            if (resultado.affectedRows === 0) {
                res.status(404).json({ erro: "Reclamação não encontrada." });
                return;
            }
            res.json({ mensagem: "Reclamação deletada com sucesso!" });
        })
        .catch(erro => {
            console.log("Erro ao deletar reclamação:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// ==================== BUSCAR ====================
function buscar(req, res) {
    var termo = req.query.termo || '';
    var idUsuario = req.query.idUsuario;
    
    if (!termo) {
        res.status(400).json({ erro: "Termo de busca não informado" });
        return;
    }
    
    if (!idUsuario) {
        res.status(400).json({ erro: "ID do usuário não informado" });
        return;
    }
    
    reclamacaoModel.buscar(termo, idUsuario)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao buscar reclamações:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// ==================== ESTATÍSTICAS ====================
function obterEstatisticas(req, res) {
    var idUsuario = req.query.idUsuario;
    
    // Se não tiver idUsuario, retorna estatísticas gerais (para admins)
    if (!idUsuario) {
        // Estatísticas gerais de todas as reclamações
        reclamacaoModel.listarTodas()
            .then(reclamacoes => {
                const stats = {
                    total: reclamacoes.length,
                    pendentes: reclamacoes.filter(r => r.statusReclamacao === 'Pendente').length,
                    emAndamento: reclamacoes.filter(r => r.statusReclamacao === 'Em andamento').length,
                    resolvidas: reclamacoes.filter(r => r.statusReclamacao === 'Resolvido').length
                };
                res.json(stats);
            })
            .catch(erro => {
                console.log("Erro ao obter estatísticas gerais:", erro.sqlMessage);
                res.status(500).json({ erro: erro.sqlMessage });
            });
    } else {
        // Estatísticas por usuário
        reclamacaoModel.obterEstatisticas(idUsuario)
            .then(resultado => res.json(resultado[0]))
            .catch(erro => {
                console.log("Erro ao obter estatísticas:", erro.sqlMessage);
                res.status(500).json({ erro: erro.sqlMessage });
            });
    }
}

// ==================== LISTAR VEÍCULOS E LOCAIS ====================
function listarVeiculos(req, res) {
    reclamacaoModel.listarVeiculos()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao listar veículos:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function listarLocais(req, res) {
    reclamacaoModel.listarLocais()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao listar locais:", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

module.exports = {
    listarTodas,
    listarPorId,
    criar,
    atualizar,
    atualizarStatus,
    deletar,
    buscar,
    obterEstatisticas,
    listarVeiculos,
    listarLocais
};