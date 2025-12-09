async function carregarReclamacoes() {
    const tabela = document.querySelector(".reclamacoes-table tbody");
    if(!tabela) return;
    
    tabela.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    const nivel = Number(sessionStorage.NIVEL_USUARIO);
    const isAdmin = nivel == 1;

    try {
        // MUDANÇA: Garantindo caminho relativo
        const response = await fetch("/reclamacoes/listar"); // ou apenas "/reclamacoes" dependendo do seu route
        
        if(!response.ok) throw new Error(`Erro: ${response.status}`);
        
        const lista = await response.json();
        
        tabela.innerHTML = "";

        if(lista.length === 0) {
            tabela.innerHTML = '<tr><td colspan="7">Nenhuma reclamação encontrada.</td></tr>';
            return;
        }

        lista.forEach(r => {
            let botoes = "";

            if (isAdmin) {
                botoes = `
                    <td class="acoes">
                        <button class="btn-editar" onclick="editarReclamacao(${r.idReclamacao})">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-excluir" onclick="excluirReclamacao(${r.idReclamacao})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>`;
            }

            tabela.innerHTML += `
                <tr>
                    <td>REC-${String(r.idReclamacao).padStart(4, "0")}</td>
                    <td>${r.dataCriacao ? new Date(r.dataCriacao).toLocaleDateString() : '-'}</td>
                    <td>${r.tipo}</td>
                    <td>${r.local || r.veiculo || "-"}</td>
                    <td>${r.statusReclamacao}</td>
                    <td>${r.descricao}</td>
                    ${botoes}
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao listar:", error);
        tabela.innerHTML = `<tr><td colspan="7" style="color:red">Erro ao carregar dados.</td></tr>`;
    }
}

async function excluirReclamacao(id) {
    if (!confirm("Deseja excluir esta reclamação?")) return;

    try {
        // MUDANÇA: Caminho relativo
        const res = await fetch(`/reclamacoes/deletar/${id}`, { method: "DELETE" });
        if(res.ok) {
            alert("Excluído com sucesso!");
            carregarReclamacoes(); 
        } else {
            alert("Erro ao excluir.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro na requisição.");
    }
}

async function editarReclamacao(id) {
    const status = prompt("Novo status: Pendente / Em andamento / Resolvido");
    if(!status) return;
    
    const descricao = prompt("Nova descrição:");
    if(!descricao) return;

    try {
        // MUDANÇA: Caminho relativo
        await fetch(`/reclamacoes/editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, descricao })
        });
        carregarReclamacoes();
    } catch (error) {
        console.error(error);
        alert("Erro ao editar.");
    }
}

window.onload = () => {
    // Certifique-se que validarSessao existe no sessao.js
    if(typeof validarSessao === 'function') {
        validarSessao();
    }
    carregarReclamacoes();
};