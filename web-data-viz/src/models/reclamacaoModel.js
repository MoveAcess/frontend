var database = require("../database/config");

// ==================== LISTAR ====================
function listarTodas() {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            u.nome AS usuarioNome,
            u.email AS usuarioEmail,
            v.tipoTransporte AS veiculoTipo,
            v.tipoVeiculo AS veiculoModelo,
            l.nome AS localNome,
            l.linha_frota AS localLinha,
            l.municipio AS localMunicipio
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        ORDER BY r.dataHoraCriacao DESC;
    `;
    return database.executar(instrucao);
}

// ==================== NOVA FUNÇÃO: LISTAR POR USUÁRIO ====================
function listarPorUsuario(idUsuario) {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            u.nome AS usuarioNome,
            u.email AS usuarioEmail,
            v.tipoTransporte AS veiculoTipo,
            v.tipoVeiculo AS veiculoModelo,
            l.nome AS localNome,
            l.linha_frota AS localLinha,
            l.municipio AS localMunicipio
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        WHERE r.fkUsuario = ${idUsuario}
        ORDER BY r.dataHoraCriacao DESC;
    `;
    return database.executar(instrucao);
}

function listarPorId(idReclamacao) {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            u.nome AS usuarioNome,
            u.email AS usuarioEmail,
            v.tipoTransporte AS veiculoTipo,
            v.tipoVeiculo AS veiculoModelo,
            l.nome AS localNome,
            l.linha_frota AS localLinha,
            l.municipio AS localMunicipio,
            l.tipo AS localEndereco
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        WHERE r.idReclamacao = ${idReclamacao};
    `;
    return database.executar(instrucao);
}

// ==================== CRIAR ====================
function criar(statusReclamacao, tipo, descricao, fkVeiculo, fkLocalEmbarque, fkUsuario) {
    var statusEscapado = statusReclamacao || 'Pendente';
    var tipoEscapado = tipo.replace(/'/g, "''");
    var descricaoEscapada = descricao.replace(/'/g, "''");
    
    var instrucao = `
        INSERT INTO reclamacao (
            statusReclamacao, 
            tipo, 
            descricao, 
            dataHoraCriacao, 
            fkVeiculo, 
            fkLocalEmbarque, 
            fkUsuario
        ) VALUES (
            '${statusEscapado}',
            '${tipoEscapado}',
            '${descricaoEscapada}',
            NOW(),
            ${fkVeiculo || 'NULL'},
            ${fkLocalEmbarque || 'NULL'},
            ${fkUsuario}
        );
    `;
    
    console.log("SQL INSERT:", instrucao);
    return database.executar(instrucao);
}

// ==================== ATUALIZAR ====================
function atualizar(idReclamacao, tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao) {
    var tipoEscapado = tipo.replace(/'/g, "''");
    var descricaoEscapada = descricao.replace(/'/g, "''");
    
    var instrucao = `
        UPDATE reclamacao
        SET tipo = '${tipoEscapado}',
            descricao = '${descricaoEscapada}',
            statusReclamacao = '${statusReclamacao}',
            fkVeiculo = ${fkVeiculo || 'NULL'},
            fkLocalEmbarque = ${fkLocalEmbarque || 'NULL'}
        WHERE idReclamacao = ${idReclamacao};
    `;
    
    console.log("SQL UPDATE:", instrucao);
    return database.executar(instrucao);
}

function atualizarStatus(idReclamacao, novoStatus) {
    var instrucao;
    
    if (novoStatus === 'Resolvido') {
        instrucao = `
            UPDATE reclamacao
            SET statusReclamacao = '${novoStatus}',
                dataHoraResolucao = NOW()
            WHERE idReclamacao = ${idReclamacao};
        `;
    } else {
        instrucao = `
            UPDATE reclamacao
            SET statusReclamacao = '${novoStatus}'
            WHERE idReclamacao = ${idReclamacao};
        `;
    }
    
    console.log("SQL UPDATE STATUS:", instrucao);
    return database.executar(instrucao);
}

// ==================== DELETAR ====================
function deletar(idReclamacao) {
    var instrucaoComentarios = `
        DELETE FROM comentarios 
        WHERE fkReclamacao = ${idReclamacao};
    `;
    
    return database.executar(instrucaoComentarios)
        .then(() => {
            var instrucao = `
                DELETE FROM reclamacao 
                WHERE idReclamacao = ${idReclamacao};
            `;
            return database.executar(instrucao);
        });
}

// ==================== BUSCAR ====================
function buscar(termo, idUsuario) {
    var termoEscapado = termo.replace(/'/g, "''");
    
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            u.nome AS usuarioNome,
            v.tipoTransporte AS veiculoTipo,
            l.nome AS localNome,
            l.linha_frota AS localLinha
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        WHERE r.fkUsuario = ${idUsuario}
          AND (r.tipo LIKE '%${termoEscapado}%'
           OR r.descricao LIKE '%${termoEscapado}%'
           OR l.nome LIKE '%${termoEscapado}%'
           OR l.linha_frota LIKE '%${termoEscapado}%'
           OR v.tipoTransporte LIKE '%${termoEscapado}%')
        ORDER BY r.dataHoraCriacao DESC;
    `;
    
    return database.executar(instrucao);
}

// ==================== ESTATÍSTICAS ====================
function obterEstatisticas(idUsuario) {
    var instrucao = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN statusReclamacao = 'Pendente' THEN 1 ELSE 0 END) as pendentes,
            SUM(CASE WHEN statusReclamacao = 'Em andamento' THEN 1 ELSE 0 END) as emAndamento,
            SUM(CASE WHEN statusReclamacao = 'Resolvido' THEN 1 ELSE 0 END) as resolvidas
        FROM reclamacao
        WHERE fkUsuario = ${idUsuario}
          AND dataHoraCriacao >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    `;
    return database.executar(instrucao);
}

// ==================== LISTAR VEÍCULOS E LOCAIS ====================
function listarVeiculos() {
    var instrucao = `
        SELECT idVeiculo, tipoTransporte, tipoVeiculo, statusAcessibilidade
        FROM veiculo
        ORDER BY tipoTransporte, tipoVeiculo;
    `;
    return database.executar(instrucao);
}

function listarLocais() {
    var instrucao = `
        SELECT idLocal, nome, municipio, linha_frota, tipo
        FROM localEmbarque
        ORDER BY nome;
    `;
    return database.executar(instrucao);
}

module.exports = {
    listarTodas,
    listarPorUsuario,
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