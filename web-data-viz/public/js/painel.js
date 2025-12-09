let complaints = [];
let currentFilter = 'Todos';
let currentSearch = '';
let currentUserId = null;
let currentUserNivel = null;
let currentUserNome = null;

// REMOVIDO: const API_BASE_URL = 'http://localhost:8080'; 
// Agora usamos caminhos relativos automáticos

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    // Carregar dados do usuário do sessionStorage
    if (!loadUserFromSession()) {
        return; 
    }
    
    loadComplaints();
    setupEventListeners();
});

// ==================== VALIDAÇÃO DE ACESSO ====================
function loadUserFromSession() {
    const idUsuario = sessionStorage.getItem('ID_USUARIO');
    const nomeUsuario = sessionStorage.getItem('NOME_USUARIO');
    const nivelAcesso = sessionStorage.getItem('NIVEL_USUARIO');
    
    console.log('🔐 Verificando sessionStorage:', { idUsuario, nomeUsuario, nivelAcesso });
    
    if (!idUsuario || !nivelAcesso) {
        console.error('❌ Usuário não logado - redirecionando para login');
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../index.html';
        return false;
    }
    
    currentUserId = parseInt(idUsuario);
    currentUserNivel = parseInt(nivelAcesso);
    currentUserNome = nomeUsuario;
    
    console.log('👤 Dados do usuário:', {
        id: currentUserId,
        nome: currentUserNome,
        nivel: currentUserNivel
    });
    
    if (currentUserNivel !== 1 && currentUserNivel !== 2) {
        console.error('❌ Acesso negado - Nível:', currentUserNivel);
        alert('Acesso negado! Apenas administradores (nível 1 ou 2) podem acessar este painel.');
        window.location.href = 'mural.html'; 
        return false;
    }
    
    console.log('✅ Usuário autorizado - Nível', currentUserNivel);
    return true;
}

// ==================== CARREGAR RECLAMAÇÕES ====================
function loadComplaints() {
    console.log('📋 Carregando todas as reclamações (admin)...');
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes`) 
        .then(res => {
            console.log('📡 Resposta da API:', res.status);
            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log('✅ Reclamações recebidas:', data.length);
            
            complaints = data.map(r => ({
                id: r.idReclamacao,
                idOriginal: r.idReclamacao,
                date: formatDate(r.dataHoraCriacao),
                time: formatTime(r.dataHoraCriacao),
                type: r.tipo || 'Não especificado',
                location: r.localNome || r.veiculoTipo || 'Local não especificado',
                priority: definePriority(r.tipo),
                status: r.statusReclamacao,
                description: r.descricao || 'Sem descrição',
                usuarioEmail: r.usuarioEmail,
                usuarioNome: r.usuarioNome,
                fkUsuario: r.fkUsuario,
                comments: []
            }));
            
            updateStats();
            renderComplaints();
        })
        .catch(err => {
            console.error("❌ Erro ao carregar reclamações:", err);
            alert("Erro ao carregar reclamações: " + err.message);
        });
}

function formatDate(dateString) {
    if(!dateString) return "--/--/----";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
}

function formatTime(dateString) {
    if(!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
}

function definePriority(tipo) {
    if (!tipo) return "Baixa";
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes("elevador") || tipoLower.includes("urgente")) return "Alta";
    if (tipoLower.includes("piso") || tipoLower.includes("rampa") || tipoLower.includes("acesso")) return "Média";
    return "Baixa";
}

function updateStats() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pendente').length;
    const inProgress = complaints.filter(c => c.status === 'Em andamento').length;
    const resolved = complaints.filter(c => c.status === 'Resolvido').length;
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    
    document.getElementById('total-complaints').textContent = total;
    document.getElementById('pending-complaints').textContent = pending;
    document.getElementById('inprogress-complaints').textContent = inProgress;
    document.getElementById('resolved-complaints').textContent = resolved;
    document.getElementById('resolution-rate').textContent = `${resolutionRate}%`;
}

function getStatusClass(status) {
    const map = {
        'Pendente': 'pendente',
        'Em andamento': 'em-andamento',
        'Resolvido': 'resolvido'
    };
    return map[status] || 'pendente';
}

function getStatusIcon(status) {
    if (status === 'Pendente') {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else if (status === 'Em andamento') {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    }
}

function renderComplaints() {
    const tbody = document.getElementById('complaints-tbody');
    const noResults = document.getElementById('no-results');
    
    let filtered = complaints;
    
    if (currentFilter !== 'Todos') {
        filtered = filtered.filter(c => c.type.includes(currentFilter));
    }
    
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(c => 
            c.id.toString().includes(searchLower) ||
            c.type.toLowerCase().includes(searchLower) ||
            c.location.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            (c.usuarioEmail && c.usuarioEmail.toLowerCase().includes(searchLower)) ||
            (c.usuarioNome && c.usuarioNome.toLowerCase().includes(searchLower))
        );
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if(noResults) noResults.style.display = 'block';
        return;
    }
    
    if(noResults) noResults.style.display = 'none';
    
    tbody.innerHTML = filtered.map(complaint => `
        <tr id="row-${complaint.idOriginal}">
            <td><span class="complaint-id">REC-${String(complaint.id).padStart(4, '0')}</span></td>
            <td>
                <div class="datetime-cell">
                    <span class="date">${complaint.date}</span>
                    <span class="time">${complaint.time}</span>
                </div>
            </td>
            <td><span class="type-badge">${complaint.type}</span></td>
            <td>
                ${complaint.location}
                <br>
                <small style="color: #6b7280;">Por: ${complaint.usuarioEmail || complaint.usuarioNome || 'Usuário'}</small>
            </td>
            <td><span class="priority-badge priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span></td>
            <td>
                <div class="status-selector">
                    <button class="status-badge status-${getStatusClass(complaint.status)}" onclick="toggleStatusMenu(${complaint.idOriginal}, event)">
                        ${getStatusIcon(complaint.status)}
                        <span>${complaint.status}</span>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="status-menu" id="status-menu-${complaint.idOriginal}">
                        <div class="status-menu-header">Atualizar Status</div>
                        <div class="status-menu-content">
                            <button class="status-option status-pendente ${complaint.status === 'Pendente' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Pendente', event)">
                                <span class="status-dot dot-pendente"></span>
                                <span>Pendente</span>
                            </button>
                            <button class="status-option status-em-andamento ${complaint.status === 'Em andamento' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Em andamento', event)">
                                <span class="status-dot dot-em-andamento"></span>
                                <span>Em andamento</span>
                            </button>
                            <button class="status-option status-resolvido ${complaint.status === 'Resolvido' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Resolvido', event)">
                                <span class="status-dot dot-resolvido"></span>
                                <span>Resolvido</span>
                            </button>
                        </div>
                    </div>
                </div>
            </td>
            <td><span class="description-text">${complaint.description}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewComplaint(${complaint.idOriginal})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn comment-btn" onclick="toggleComments(${complaint.idOriginal})" title="Comentários">
                        <i class="fas fa-comment"></i>
                    </button>
                </div>
            </td>
        </tr>
        <tr id="comments-row-${complaint.idOriginal}" class="comments-row" style="display: none;">
            <td colspan="8">
                <div class="comments-section" id="comments-section-${complaint.idOriginal}">
                    <div class="comments-header">
                        <h4>💬 Comentários - REC-${String(complaint.id).padStart(4, '0')}</h4>
                        <button class="close-comments-btn" onclick="toggleComments(${complaint.idOriginal})">✕</button>
                    </div>
                    <div class="comments-list" id="comments-list-${complaint.idOriginal}">
                        <div class="loading-comments">Carregando comentários...</div>
                    </div>
                    <div class="add-comment-form">
                        <textarea id="comment-input-${complaint.idOriginal}" placeholder="Escreva um comentário..." rows="2"></textarea>
                        <button class="add-comment-btn" onclick="addComment(${complaint.idOriginal})">
                            Enviar
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== FUNÇÕES DE COMENTÁRIOS ====================
function toggleComments(id) {
    const commentsRow = document.getElementById(`comments-row-${id}`);
    const isVisible = commentsRow.style.display !== 'none';
    
    document.querySelectorAll('.comments-row').forEach(row => {
        row.style.display = 'none';
    });
    
    if (!isVisible) {
        commentsRow.style.display = 'table-row';
        loadComments(id);
    }
}

function loadComments(idReclamacao) {
    const commentsList = document.getElementById(`comments-list-${idReclamacao}`);
    commentsList.innerHTML = '<div class="loading-comments">Carregando...</div>';
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes/${idReclamacao}/comentarios`)
        .then(res => {
            if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
            return res.json();
        })
        .then(comments => {
            if (!comments || comments.length === 0) {
                commentsList.innerHTML = '<div class="no-comments">Nenhum comentário ainda. Seja o primeiro!</div>';
                return;
            }
            
            commentsList.innerHTML = comments.map(c => {
                const isMyComment = (c.idUsuario === currentUserId);
                
                return `
                <div class="comment-item" id="comment-${c.idComentario}">
                    <div class="comment-header">
                        <span class="comment-author">
                            ${c.usuarioEmail}
                            ${isMyComment ? '<span style="color: #3B82F6; font-size: 11px; margin-left: 6px;">(Você)</span>' : ''}
                        </span>
                        <span class="comment-date">${formatDate(c.dataHoraComentario)} ${formatTime(c.dataHoraComentario)}</span>
                    </div>
                    <div class="comment-text" id="comment-text-${c.idComentario}">${c.comentario}</div>
                    ${isMyComment ? `
                        <div class="comment-actions">
                            <button class="comment-action-btn edit-btn" onclick="editComment(${c.idComentario}, '${c.comentario.replace(/'/g, "\\'")}')">
                                Editar
                            </button>
                            <button class="comment-action-btn delete-btn" onclick="deleteComment(${c.idComentario}, ${idReclamacao})">
                                Excluir
                            </button>
                        </div>
                    ` : ''}
                </div>
            `}).join('');
        })
        .catch(err => {
            console.error("Erro ao carregar comentários:", err);
            commentsList.innerHTML = `<div class="error-comments">Erro: ${err.message}</div>`;
        });
}

function addComment(idReclamacao) {
    const input = document.getElementById(`comment-input-${idReclamacao}`);
    const texto = input.value.trim();
    
    if (!texto) {
        alert("Digite um comentário!");
        return;
    }
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes/${idReclamacao}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId, texto: texto })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao adicionar comentário');
        return res.json();
    })
    .then(() => {
        input.value = '';
        loadComments(idReclamacao);
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao adicionar comentário.");
    });
}

function editComment(idComentario, textoAtual) {
    const novoTexto = prompt("Editar comentário:", textoAtual);
    
    if (novoTexto === null || novoTexto.trim() === '') return;
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes/comentarios/${idComentario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId, texto: novoTexto.trim() })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao editar');
        return res.json();
    })
    .then(() => {
        document.getElementById(`comment-text-${idComentario}`).textContent = novoTexto.trim();
        alert('Comentário editado com sucesso!');
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao editar comentário.");
    });
}

function deleteComment(idComentario, idReclamacao) {
    if (!confirm("Deseja excluir este comentário?")) return;
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes/comentarios/${idComentario}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao excluir');
        return res.json();
    })
    .then(() => {
        loadComments(idReclamacao);
        alert('Comentário excluído com sucesso!');
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao excluir comentário.");
    });
}

// ==================== FUNÇÕES DE STATUS ====================
function toggleStatusMenu(id, event) {
    event.stopPropagation();
    document.querySelectorAll('.status-menu').forEach(menu => {
        if (menu.id !== `status-menu-${id}`) menu.classList.remove('show');
    });
    const menu = document.getElementById(`status-menu-${id}`);
    if(menu) menu.classList.toggle('show');
}

function updateStatus(id, newStatus, event) {
    event.stopPropagation();
    const menu = document.getElementById(`status-menu-${id}`);
    if (menu) menu.classList.remove('show');
    
    // MUDANÇA AQUI: Caminho relativo
    fetch(`/reclamacoes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar');
        return res.json().catch(() => ({}));
    })
    .then(() => {
        loadComplaints();
        alert(`Status atualizado para: ${newStatus}`);
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao atualizar status.");
    });
}

function viewComplaint(id) {
    const complaint = complaints.find(c => c.idOriginal === id);
    if (complaint) {
        alert(`Reclamação #REC-${String(complaint.id).padStart(4, '0')}\n\nStatus: ${complaint.status}\nTipo: ${complaint.type}\nLocal: ${complaint.location}\nPrioridade: ${complaint.priority}\nUsuário: ${complaint.usuarioEmail}\n\nDescrição: ${complaint.description}`);
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.addEventListener('click', function() {
        document.querySelectorAll('.status-menu').forEach(menu => menu.classList.remove('show'));
        const filterMenu = document.getElementById('filter-menu');
        if(filterMenu) filterMenu.classList.remove('show');
    });
    
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            renderComplaints();
        });
    }
    
    const filterBtn = document.getElementById('filter-button');
    if(filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('filter-menu').classList.toggle('show');
        });
    }
    
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            const filterText = document.getElementById('filter-text');
            if(filterText) filterText.textContent = currentFilter;
            renderComplaints();
            document.getElementById('filter-menu').classList.remove('show');
        });
    });
}