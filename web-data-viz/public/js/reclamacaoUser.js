function listaReclamacoesUser() {
    fetch("/reclamacoesUsers/listarReclamacoesUser", 
        {
         method: "GET" 
        })
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log(dados);
                    var tabela = document.getElementById("tabelaReclamacoesUser");
                    tabela.innerHTML = "";
                    for (var i = 0; i < dados.length; i++) {
                        tabela.innerHTML += `
                            <tr>
                                <td>${dados[i].idReclamacao}</td>
                                <td>${dados[i].titulo}</td>
                                <td>${dados[i].descricao}</td>
                                <td>${dados[i].status}</td>
                                <td>${dados[i].dataCriacao}</td>
                            </tr>
                        `;
                    }
                });
            } else {
                console.error("Erro ao listar reclamações do usuário.");
            }
        })
        .catch(function (erro) {
            console.error("Erro na requisição:", erro);
        });
}

function cadastrarReclamacaoUser(idUsuario, titulo, descricao) {
    fetch("/reclamacoesUsers/cadastrarReclamacaoUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idUsuario: idUsuario, titulo: titulo, descricao: descricao })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Reclamação cadastrada com sucesso.");
            listaReclamacoesUser(); // Atualiza a lista após o cadastro
        } else {
            console.error("Erro ao cadastrar a reclamação.");
        }
    })
    .catch(function (erro) {
        console.error("Erro na requisição:", erro);
    });
}

function editarReclamacaoUser(idReclamacao, novoStatus) {
    fetch(`/reclamacoesUsers/editarReclamacaoUser/${idReclamacao}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Reclamação atualizada com sucesso.");
            listaReclamacoesUser(); // Atualiza a lista após a edição
        } else {
            console.error("Erro ao atualizar a reclamação.");
        }
    })
    .catch(function (erro) {
        console.error("Erro na requisição:", erro);
    });
}

function deletarReclamacaoUser(idReclamacao) {
    fetch(`/reclamacoesUsers/deletarReclamacaoUser/${idReclamacao}`, {
        method: "DELETE"
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Reclamação deletada com sucesso.");
            listaReclamacoesUser(); // Atualiza a lista após a exclusão
        } else {
            console.error("Erro ao deletar a reclamação.");
        }
    })
    .catch(function (erro) {
        console.error("Erro na requisição:", erro);
    });
}
// Chama a função para listar as reclamações quando a página carrega
window.onload = function() {
    listaReclamacoesUser();
};
