var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    const instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            u.email AS usuarioEmail,
            COALESCE(v.nome, le.nome, 'Local não informado') AS local
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque le ON r.fkLocalEmbarque = le.idLocal
        WHERE r.fkUsuario = ${idUsuario}
        ORDER BY r.dataHoraCriacao DESC;
    `;
    return database.executar(instrucao);
}

// Parte do filtro
function filtrarReclamacoes(idUsuario, filtros){
    let sql = 'SELECT * FROM reclamacao WHERE fkUsuario = ?';
    let params = [idUsuario];

    if (filtros.status){
        sql += ' AND status = ?';
        params.push(filtros.status);
    }

    if (filtros.tipo){
        sql += ' AND tipo = ?';
        params.push(filtros.tipo);
    }

    if (filtros.local){
        sql += ' AND local = ?';
        params.push(filtros.local);
    }

    if (filtros.dataInicio){
        sql += ' AND data <= ?';
        params.push(filtros.dataInicio);
    }

    if (filtros.dataFim){
        sql += ' AND data >= ?';
        params.push(filtros.dataFim);
    }
}

function cadastrar(tipo, descricao, fkUsuario, fkVeiculo, fkLocal) {
    const instrucao = `
        INSERT INTO reclamacao 
        (statusReclamacao, tipo, descricao, fkUsuario, fkVeiculo, fkLocalEmbarque)
        VALUES ('Pendente', '${tipo}', '${descricao}', ${fkUsuario}, ${fkVeiculo || "NULL"}, ${fkLocal || "NULL"});
    `;
    return database.executar(instrucao);
}

function deletar(idReclamacao) {
    const instrucao = `
        DELETE FROM reclamacao WHERE idReclamacao = ${idReclamacao};
    `;
    return database.executar(instrucao);
}

function editar(idReclamacao, tipo, descricao, status) {
    const instrucao = `
        UPDATE reclamacao
        SET tipo = '${tipo}',
            descricao = '${descricao}',
            statusReclamacao = '${status}'
        WHERE idReclamacao = ${idReclamacao};
    `;
    return database.executar(instrucao);
}

module.exports = {
    listarPorUsuario,
    filtrarReclamacoes,
    cadastrar,
    deletar,
    editar
};
