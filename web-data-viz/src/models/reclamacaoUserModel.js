var database = require("../database/dbConfig");

function cadastrarReclamacaoUser(idUsuario, titulo, descricao, dataReclamacao) {
    console.log("Cadastrando reclamação para o usuário:", idUsuario);
    var instrucaoSql = `INSERT INTO reclamacaoUser (fk_usuario, titulo, descricao, dataReclamacao) VALUES (${idUsuario}, '${titulo}', '${descricao}', '${dataReclamacao}');`;   
    return database.executar(instrucaoSql);
}

function listarReclamacoesUser(idUsuario) {
    console.log("Listando reclamações para o usuário:", idUsuario);
    var instrucaoSql = `SELECT * FROM reclamacaoUser WHERE fk_usuario = ${idUsuario};`;
    return database.executar(instrucaoSql);
}   

function editarReclamacaoUser(idReclamacao, novoStatus) {
    console.log("Editando reclamação com ID:", idReclamacao);
    var instrucaoSql = `UPDATE reclamacaoUser SET status = '${novoStatus}' WHERE idReclamacao = ${idReclamacao};`;
    return database.executar(instrucaoSql);
}

function deletarReclamacaoUser(idReclamacao) {
    console.log("Deletando reclamação com ID:", idReclamacao);
    var instrucaoSql = `DELETE FROM reclamacaoUser WHERE idReclamacao = ${idReclamacao};`;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarReclamacaoUser,
    listarReclamacoesUser,
    editarReclamacaoUser,
    deletarReclamacaoUser
}