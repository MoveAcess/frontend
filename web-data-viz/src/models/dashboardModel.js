var database = require("../database/config");

function obterMetricas(idUsuario) {
    console.log("ACESSEI O DASHBOARD MODEL para Unificar Tabelas. Usuário:", idUsuario);
    
    if (!idUsuario) idUsuario = 0;

    var instrucaoSql = `
        SELECT 
            -- KPI 1: Mantive apenas frota (veículos) pois o título do Card é "Ônibus Acessíveis"
            ROUND(
                (SELECT COUNT(idVeiculo) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível') * 100.0 / 
                NULLIF((SELECT COUNT(idVeiculo) FROM veiculo), 0), 0
            ) as kpi_porcentagem_total,

            -- KPI 2: Elevadores inoperantes (localEmbarque)
            (SELECT COUNT(idLocal) FROM localEmbarque WHERE tipo LIKE '%inoperante%') as kpi_elevadores_inoperantes,

            -- KPI 3: Minhas Reclamações
            (SELECT COUNT(idReclamacao) FROM reclamacao WHERE fkUsuario = ${idUsuario}) as kpi_minhas_reclamacoes,

            -- KPI 4: Frota Operando (Totalmente Acessível)
            (SELECT COUNT(idVeiculo) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível') as kpi_frota_operando,

            -- =================================================================================
            -- GRÁFICO 1: EVOLUÇÃO (VEÍCULOS + LOCAL EMBARQUE)
            -- Lógica: Soma (Veículos 'Totalmente' + Locais com Elevador Funcionando) / (Total Veículos + Total Locais)
            -- =================================================================================
            
            -- 2019
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2019%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2019%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2019%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2019%'), 0)) as ano_2019,

            -- 2020
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2020%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2020%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2020%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2020%'), 0)) as ano_2020,

            -- 2021
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2021%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2021%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2021%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2021%'), 0)) as ano_2021,

            -- 2022
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2022%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2022%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2022%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2022%'), 0)) as ano_2022,

            -- 2023
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2023%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2023%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2023%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2023%'), 0)) as ano_2023,

            -- 2024
            ROUND(((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível' AND ano LIKE '%2024%') + 
             (SELECT COUNT(*) FROM localEmbarque WHERE tipo LIKE '%Elevador%' AND tipo NOT LIKE '%inoperante%' AND ano LIKE '%2024%')) * 100.0 / 
             NULLIF((SELECT COUNT(*) FROM veiculo WHERE ano LIKE '%2024%') + (SELECT COUNT(*) FROM localEmbarque WHERE ano LIKE '%2024%'), 0)) as ano_2024,

            -- =================================================================================
            -- GRÁFICO 2: DISTRIBUIÇÃO (Apenas Veículos por enquanto, pois Locais não tem status padronizado)
            -- =================================================================================
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Totalmente Acessível') as dist_totalmente,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Parcialmente Acessível') as dist_parcialmente,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Não Acessível') as dist_nao_acessivel,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Em Adaptação') as dist_em_adaptacao

        FROM DUAL;
    `;
    
    console.log("Executando SQL unificado...");
    return database.executar(instrucaoSql);
}

module.exports = {
    obterMetricas
};