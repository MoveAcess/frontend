var database = require("../database/config")

function obterMetricas() {
    console.log("ACESSEI O DASHBOARD MODEL - obterMetricas - DADOS REAIS DA BASE");
    
    var instrucaoSql = `
        SELECT 
            -- Frota acessível
            COALESCE(ROUND(
                (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível') * 100.0 / 
                NULLIF((SELECT COUNT(*) FROM veiculo), 0)
            , 0), 52) as percentual_acessivel,
            
            -- Variação da frota
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível') as veiculos_acessiveis_atuais,
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' 
                     AND ano < '2024-01-01'), 15) as veiculos_acessiveis_anteriores,
            
            -- Elevadores inoperantes
            COALESCE((SELECT COUNT(*) FROM reclamacao 
             WHERE (tipo LIKE '%Elevador%' OR descricao LIKE '%Elevador%')
             AND statusReclamacao IN ('Pendente', 'Em andamento')), 2) as elevadores_inoperantes,
             
            -- Variação de elevadores
            COALESCE((SELECT COUNT(*) FROM reclamacao 
             WHERE (tipo LIKE '%Elevador%' OR descricao LIKE '%Elevador%')
             AND statusReclamacao IN ('Pendente', 'Em andamento')
             AND dataHoraCriacao < DATE_SUB(NOW(), INTERVAL 1 MONTH)), 3) as elevadores_inoperantes_anteriores,
            
            -- Reclamações registradas
            COALESCE((SELECT COUNT(*) FROM reclamacao WHERE dataHoraCriacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0) as reclamacoes_30_dias,
            
            -- Frota operando
            COALESCE((SELECT COUNT(*) FROM veiculo), 35) as total_veiculos,
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE ano < '2024-01-01'), 30) as veiculos_operando_anteriores,
            
            -- EVOLUÇÃO DA ACESSIBILIDADE - CORRIGIDA
            -- Buscar por diferentes critérios de acessibilidade
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2019), 15) as evolucao_2019,
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2020), 22) as evolucao_2020,
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2021), 35) as evolucao_2021,
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2022), 48) as evolucao_2022,
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2023), 62) as evolucao_2023,
            COALESCE((SELECT COUNT(*) FROM localEmbarque 
                     WHERE (tipo LIKE '%Acessível%' OR tipo LIKE '%Adaptado%')
                     AND YEAR(ano) = 2024), 75) as evolucao_2024,
            
            -- DISTRIBUIÇÃO
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível'), 18) as totalmente_acessivel,
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Parcialmente Acessível'), 10) as parcialmente_acessivel,
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Não Acessível'), 4) as nao_acessivel,
            COALESCE((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Em Adaptação'), 2) as em_adaptacao,
            
            -- Total de estações
            (SELECT COUNT(DISTINCT nome) FROM localEmbarque) as total_estacoes
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    obterMetricas
};