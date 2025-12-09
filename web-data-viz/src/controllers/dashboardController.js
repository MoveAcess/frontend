var dashboardModel = require("../models/dashboardModel");

function obterMetricas(req, res) {
    // Agora pegamos o idUsuario que virá via Query String (ex: /obterMetricas?idUsuario=1)
    var idUsuario = req.query.idUsuario;

    console.log("CONTROLLER - Iniciando com usuário ID:", idUsuario);

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "ID do usuário indefinido!" });
        return;
    }

    dashboardModel.obterMetricas(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                const dados = resultado[0];

                // Montando o objeto JSON final sem valores hardcoded
                const responseData = {
                    // KPI 1: % Total
                    frota_acessivel: (dados.kpi_porcentagem_total || 0) + '%',
                    
                    // KPI 2: Elevadores Inoperantes (localEmbarque)
                    elevadores_inoperantes: dados.kpi_elevadores_inoperantes || 0,
                    
                    // KPI 3: Reclamações do Usuário
                    reclamacoes_registradas: dados.kpi_minhas_reclamacoes || 0,
                    
                    // KPI 4: Quantidade Veículos Totalmente Acessíveis
                    veiculos_operando: dados.kpi_frota_operando || 0,
                    
                    // Gráfico 1: Evolução (%) por ano
                    evolucao_acessibilidade: [
                        Math.round(dados.ano_2019 || 0),
                        Math.round(dados.ano_2020 || 0),
                        Math.round(dados.ano_2021 || 0),
                        Math.round(dados.ano_2022 || 0),
                        Math.round(dados.ano_2023 || 0),
                        Math.round(dados.ano_2024 || 0)
                    ],
                    
                    // Gráfico 2: Distribuição (Pizza)
                    distribuicao_acessibilidade: [
                        dados.dist_totalmente || 0,
                        dados.dist_parcialmente || 0,
                        dados.dist_nao_acessivel || 0,
                        dados.dist_em_adaptacao || 0
                    ]
                };

                res.status(200).json(responseData);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as métricas.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    obterMetricas
};