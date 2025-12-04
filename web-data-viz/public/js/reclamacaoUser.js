// Helper para obter id do usuário
function getIdUsuario() {
    return sessionStorage.ID_USUARIO;
}

/**
 * Fazer POST para criar nova reclamação e atualizar a lista
 * Endpoint usado: POST /reclamacoesUsuario/cadastrar
 * Body: { fkUsuario, titulo, descricao, local }
 */

async function cadastrarReclamacaoUser() {
    const titulo = document.getElementById("inputTitulo").value;
    const descricao = document.getElementById("inputDescricao").value;
    const local = document.getElementById("inputLocal").value;
    const veiculo = document.getElementById("inputVeiculo").value;
    const idUsuario = getIdUsuario();

    fetch("/reclamacoesUsuario/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkUsuario: idUsuario,
            titulo: titulo,
            descricao: descricao,
            local: local,
            veiculo: veiculo
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar reclamação");
        }
        return response.json();
    })
    .then(data => {
        console.log("Reclamação cadastrada com sucesso:", data);
        listarReclamacoesUser(idUsuario); // Atualiza a lista após cadastro
        document.getElementById("modalNovaReclamacao").style.display = "none"; // Fecha o modal
    })
    .catch(error => {
        console.error("Erro:", error);
    });
}

/* ===========================
   Bindings do modal / botão
   =========================== */
document.addEventListener("DOMContentLoaded", () => {
    const btnNova = document.getElementById("btnNovaReclamacao");
    const modal = document.getElementById("modalNovaReclamacao");
    const btnFechar = document.getElementById("btnFecharModal");
    const btnEnviar = document.getElementById("btnEnviarReclamacao");

    if (btnNova && modal) {
        btnNova.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (btnFechar && modal) {
        btnFechar.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if (btnEnviar) {
        btnEnviar.addEventListener("click", (e) => {
            e.preventDefault();
            cadastrarReclamacaoUser();
        });
    }

    // fecha o modal ao clicar fora do conteúdo
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }
});

async function listarReclamacoesUser(idUsuario) {
    try {
        const resposta = await fetch(`/reclamacoesUsuario/listar/${idUsuario}`);

        if (!resposta.ok) {
            throw new Error("Falha ao buscar reclamações do usuário");
        }

        const dados = await resposta.json();

        const container = document.getElementById("container-reclamacoes");
        const semReclamacoes = document.getElementById("mensagem-sem-reclamacoes");

        // *** GARANTIA DE EXISTÊNCIA DOS ELEMENTOS ***
        if (!container || !semReclamacoes) {
            console.error("Elementos HTML não encontrados no perfil.html");
            return;
        }

        // Limpa antes de preencher
        container.innerHTML = "";

        // CASO NÃO TENHA RECLAMAÇÕES
        if (dados.length === 0) {
            semReclamacoes.style.display = "block";
            return; // <-- IMPORTANTE!
        }

        // Se chegou aqui, tem reclamações
        semReclamacoes.style.display = "none";

        let tabela = `
            <table class="tabela-reclamacoes">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
        `;

        dados.forEach(r => {
            tabela += `
                <tr>
                    <td>${r.idReclamacao}</td>
                    <td>${r.titulo}</td>
                    <td>${r.descricao}</td>
                    <td>${r.status}</td>
                    <td>${new Date(r.dataCriacao).toLocaleDateString()}</td>
                </tr>
            `;
        });

        tabela += `</tbody></table>`;

        container.innerHTML = tabela;

    } catch (erro) {
        console.error("Erro ao listar reclamações:", erro);
    }
}
