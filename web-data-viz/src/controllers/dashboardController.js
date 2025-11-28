var dashboardModel = require("../models/dashboardModel");

function obterMetricas(req, res) {
    console.log("CONTROLLER - obterMetricas - DADOS REAIS");
    
    dashboardModel.obterMetricas()
        .then(function (resultado) {
            if (resultado.length > 0) {
                const dados = resultado[0];
                
                console.log("Dados REAIS do banco:", dados);
                
                // Calcular variações PERCENTUAIS baseadas em dados REAIS
                const variacaoFrotaPercentual = dados.veiculos_acessiveis_anteriores > 0 ? 
                    Math.round(((dados.veiculos_acessiveis_atuais - dados.veiculos_acessiveis_anteriores) / dados.veiculos_acessiveis_anteriores) * 100) : 0;
                
                const variacaoElevadoresPercentual = dados.elevadores_inoperantes_anteriores > 0 ? 
                    Math.round(((dados.elevadores_inoperantes - dados.elevadores_inoperantes_anteriores) / dados.elevadores_inoperantes_anteriores) * 100) : 0;
                
                const variacaoVeiculos = dados.total_veiculos - dados.veiculos_operando_anteriores;
                
                // Calcular percentuais para evolução (baseado nos dados REAIS da planilha)
                const totalEstacoes = dados.total_estacoes || 94; // Fallback para 94 estações
                const evolucaoPercentual = [
                    Math.round((dados.evolucao_2019 / totalEstacoes) * 100),
                    Math.round((dados.evolucao_2020 / totalEstacoes) * 100),
                    Math.round((dados.evolucao_2021 / totalEstacoes) * 100),
                    Math.round((dados.evolucao_2022 / totalEstacoes) * 100),
                    Math.round((dados.evolucao_2023 / totalEstacoes) * 100),
                    Math.round((dados.evolucao_2024 / totalEstacoes) * 100)
                ];
                
                const responseData = {
                    // Card 1: Ônibus Acessíveis - DADOS REAIS
                    frota_acessivel: dados.percentual_acessivel + '%',
                    variacao_frota: variacaoFrotaPercentual > 0 ? 
                        `+${variacaoFrotaPercentual}%` : `${variacaoFrotaPercentual}%`,
                    
                    // Card 2: Elevadores Inoperantes - DADOS REAIS
                    elevadores_inoperantes: dados.elevadores_inoperantes,
                    variacao_elevadores: variacaoElevadoresPercentual > 0 ? 
                        `+${variacaoElevadoresPercentual}%` : `${variacaoElevadoresPercentual}%`,
                    
                    // Card 3: Reclamações Registradas - DADOS REAIS
                    reclamacoes_registradas: dados.reclamacoes_30_dias,
                    
                    // Card 4: Frota Operando - DADOS REAIS
                    veiculos_operando: dados.total_veiculos,
                    variacao_veiculos: variacaoVeiculos > 0 ? `+${variacaoVeiculos}` : `${variacaoVeiculos}`,
                    
                    // Gráfico de evolução - DADOS REAIS da sua base
                    evolucao_acessibilidade: evolucaoPercentual,
                    
                    // Gráfico de distribuição - DADOS REAIS
                    distribuicao_acessibilidade: [
                        dados.totalmente_acessivel,
                        dados.parcialmente_acessivel,
                        dados.nao_acessivel,
                        dados.em_adaptacao
                    ]
                };
                
                console.log("Dados processados (100% REAIS):", responseData);
                res.status(200).json(responseData);
                
            } else {
                console.log("Nenhum dado REAL encontrado no banco");
                res.status(200).json({
                    frota_acessivel: '0%',
                    variacao_frota: '0%',
                    elevadores_inoperantes: 0,
                    variacao_elevadores: '0%',
                    reclamacoes_registradas: 0,
                    veiculos_operando: 0,
                    variacao_veiculos: '0',
                    evolucao_acessibilidade: [0, 0, 0, 0, 0, 0],
                    distribuicao_acessibilidade: [0, 0, 0, 0]
                });
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar métricas REAIS:", erro);
            res.status(500).json({ 
                error: "Erro ao carregar dados do dashboard",
                details: erro.sqlMessage 
            });
        });
}

module.exports = {
    obterMetricas
};