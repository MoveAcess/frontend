let complaints = [];
let currentSearch = '';
let currentUserId = null;
const API_BASE_URL = 'http://localhost:8080';

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    if (!loadUserFromSession()) return;
    loadComplaints();
    setupEventListeners();
});

// Carregar usuário do sessionStorage
function loadUserFromSession() {
    const idUsuario = sessionStorage.getItem('ID_USUARIO');
    const nomeUsuario = sessionStorage.getItem('NOME_USUARIO');

    console.log('SessionStorage:', { idUsuario, nomeUsuario });

    if (!idUsuario) {
        alert('Você precisa fazer login primeiro.');
        window.location.href = '../html/login.html';
        return false;
    }

    currentUserId = parseInt(idUsuario);

    console.log("Usuário autenticado:", {
        id: currentUserId,
        nome: nomeUsuario
    });

    return true;
}

// ==================== CARREGAR APENAS AS RECLAMAÇÕES DO USUÁRIO ====================
function loadComplaints() {
    fetch(`${API_BASE_URL}/reclamacoesUsuario/${currentUserId}`)
        .then(res => {
            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            complaints = data.map(r => ({
                id: r.idReclamacao,
                idOriginal: r.idReclamacao,
                date: formatDate(r.dataHoraCriacao),
                time: formatTime(r.dataHoraCriacao),
                type: r.tipo || 'Não especificado',
                location: r.local || 'Local não informado',
                priority: definePriority(r.tipo),
                status: r.statusReclamacao,
                description: r.descricao || 'Sem descrição',
                usuarioEmail: r.usuarioEmail,
                comments: []
            }));
            renderComplaints();
        })
        .catch(err => {
            console.error("Erro:", err);
            alert("Erro ao carregar reclamações!");
        });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
}

function definePriority(tipo) {
    if (!tipo) return "Baixa";
    const t = tipo.toLowerCase();
    if (t.includes("elevador") || t.includes("urgente")) return "Alta";
    if (t.includes("piso") || t.includes("rampa") || t.includes("acesso")) return "Média";
    return "Baixa";
}

// ==================== RENDERIZAR LISTA ====================
function renderComplaints() {
    const tbody = document.getElementById('complaints-tbody');
    const noResults = document.getElementById('no-results');

    let filtered = complaints;

    if (currentSearch) {
        const s = currentSearch.toLowerCase();
        filtered = filtered.filter(c =>
            c.id.toString().includes(s) ||
            c.type.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    tbody.innerHTML = filtered.map(c => `
        <tr id="row-${c.idOriginal}">
            <td><span class="complaint-id">REC-${c.id}</span></td>
            <td>
                <div class="datetime-cell">
                    <span class="date">${c.date}</span>
                    <span class="time">${c.time}</span>
                </div>
            </td>
            <td><span class="type-badge">${c.type}</span></td>
            <td>${c.location}</td>
            <td><span class="priority-badge priority-${c.priority.toLowerCase()}">${c.priority}</span></td>
            <td>
                <span class="status-badge status-${c.status.replace(" ", "-").toLowerCase()}">
                    ${c.status}
                </span>
            </td>
            <td><span class="description-text">${c.description}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewComplaint(${c.idOriginal})">
                        👁️
                    </button>
                    <button class="action-btn comment-btn" onclick="toggleComments(${c.idOriginal})">
                        💬
                    </button>
                </div>
            </td>
        </tr>

        <tr id="comments-row-${c.idOriginal}" class="comments-row" style="display: none;">
            <td colspan="8">
                <div class="comments-section" id="comments-section-${c.idOriginal}">
                    <div class="comments-header">
                        <h4>💬 Comentários - REC-${c.id}</h4>
                        <button class="close-comments-btn" onclick="toggleComments(${c.idOriginal})">✕</button>
                    </div>

                    <div class="comments-list" id="comments-list-${c.idOriginal}">
                        <div class="loading-comments">Carregando...</div>
                    </div>

                    <div class="add-comment-form">
                        <textarea id="comment-input-${c.idOriginal}" placeholder="Escreva um comentário..." rows="2"></textarea>
                        <button class="add-comment-btn" onclick="addComment(${c.idOriginal})">
                            Enviar
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== COMENTÁRIOS ====================
function toggleComments(id) {
    const row = document.getElementById(`comments-row-${id}`);
    const isVisible = row.style.display !== 'none';

    document.querySelectorAll('.comments-row').forEach(r => r.style.display = 'none');

    if (!isVisible) {
        row.style.display = 'table-row';
        loadComments(id);
    }
}

function loadComments(idReclamacao) {
    const list = document.getElementById(`comments-list-${idReclamacao}`);
    list.innerHTML = '<div class="loading-comments">Carregando...</div>';

    fetch(`${API_BASE_URL}/reclamacoes/${idReclamacao}/comentarios`)
        .then(r => r.json())
        .then(comments => {
            if (!comments.length) {
                list.innerHTML = '<div class="no-comments">Nenhum comentário.</div>';
                return;
            }

            list.innerHTML = comments.map(c => `
                <div class="comment-item" id="comment-${c.idComentario}">
                    <div class="comment-header">
                        <span class="comment-author">${c.usuarioEmail}</span>
                        <span class="comment-date">${formatDate(c.dataHoraComentario)} ${formatTime(c.dataHoraComentario)}</span>
                    </div>

                    <div class="comment-text" id="comment-text-${c.idComentario}">
                        ${c.comentario}
                    </div>

                    ${c.idUsuario === currentUserId ? `
                        <div class="comment-actions">
                            <button onclick="editComment(${c.idComentario}, '${c.comentario.replace(/'/g, "\\'")}')">Editar</button>
                            <button onclick="deleteComment(${c.idComentario}, ${idReclamacao})">Excluir</button>
                        </div>
                    ` : ""}
                </div>
            `).join('');
        });
}

function addComment(idReclamacao) {
    const textarea = document.getElementById(`comment-input-${idReclamacao}`);
    const comentario = textarea.value.trim();

    if (!comentario) return alert("Digite algo!");

    fetch(`${API_BASE_URL}/comentarios/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            comentario,
            fkUsuario: currentUserId,
            fkReclamacao: idReclamacao
        })
    }).then(r => {
        if (!r.ok) throw new Error();
        textarea.value = "";
        loadComments(idReclamacao);
    });
}

function deleteComment(idComentario, idReclamacao) {
    if (!confirm("Excluir comentário?")) return;

    fetch(`${API_BASE_URL}/comentarios/${idComentario}`, { method: "DELETE" })
        .then(r => {
            if (!r.ok) throw new Error();
            loadComments(idReclamacao);
        });
}

function editComment(idComentario, textoAtual) {
    const novo = prompt("Editar comentário:", textoAtual);
    if (!novo) return;

    fetch(`${API_BASE_URL}/comentarios/${idComentario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario: novo })
    })
        .then(r => {
            if (!r.ok) throw new Error();
            document.getElementById(`comment-text-${idComentario}`).innerText = novo;
        });
}
