var database = require("../database/config.js");

// ======================= CADASTRAR ==========================
function cadastrarReclamacaoUser(fkUsuario, titulo, descricao, local, dataCriacao, veiculo) {
    if (!fkUsuario || !titulo || !descricao || !local || !dataCriacao || !veiculo) {
        console.error("❌ Dados incompletos no Model ao cadastrar reclamação.");
        return Promise.reject("Dados incompletos para cadastro.");
    }
    var instrucao = `
        INSERT INTO reclamacao (fkUsuario, titulo, descricao, local, dataReclamacao, statusReclamacao, veiculo)
        VALUES (${fkUsuario}, '${titulo}', '${descricao}', '${local}', '${dataCriacao}', 'Pendente', '${veiculo}');
    `;
    console.log("📌 Executando SQL (Cadastrar Reclamação):\n" + instrucao)
    return database.executar(instrucao);
}

// ======================= LISTAR ==========================
function listarReclamacoesUser(idUsuario) {
    if (!idUsuario) {
        console.error("❌ ID do usuário não informado no Model ao listar reclamações.");
        return Promise.reject("ID do usuário obrigatório.");
    }

    var instrucao = `
        SELECT idReclamacao, titulo, descricao, dataReclamacao, statusReclamacao
        FROM reclamacao
        WHERE fkUsuario = ${idUsuario}
        ORDER BY dataReclamacao DESC;
    `;

    console.log("📌 Executando SQL (Listar Reclamações):\n" + instrucao);
    return database.executar(instrucao);
}

// ======================= EDITAR STATUS ==========================
function editarReclamacaoUser(idReclamacao, novoStatus) {
    if (!idReclamacao || !novoStatus) {
        console.error("❌ Dados incompletos no Model ao editar status.");
        return Promise.reject("Dados incompletos para edição.");
    }

    var instrucao = `
        UPDATE reclamacao
        SET statusReclamacao = '${novoStatus}'
        WHERE idReclamacao = ${idReclamacao};
    `;

    console.log("📌 Executando SQL (Editar Reclamação):\n" + instrucao);
    return database.executar(instrucao);
}

// ======================= DELETAR ==========================
function deletarReclamacaoUser(idReclamacao) {
    if (!idReclamacao) {
        console.error("❌ ID da reclamação não informado no Model ao deletar.");
        return Promise.reject("ID obrigatório para deletar.");
    }

    var instrucao = `
        DELETE FROM reclamacao
        WHERE idReclamacao = ${idReclamacao};
    `;

    console.log("📌 Executando SQL (Deletar Reclamação):\n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrarReclamacaoUser,
    listarReclamacoesUser,
    editarReclamacaoUser,
    deletarReclamacaoUser
};
