const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    mudarModulo('usuarios');
});

function mudarModulo(modulo) {
    document.querySelectorAll('.sidebar nav button').forEach(btn => btn.classList.remove('active'));
    event && event.target.classList.add('active');

    const container = document.getElementById('conteudo-principal');

    switch (modulo) {
        case 'usuarios':
            renderizarModuloUsuarios(container);
            break;
        case 'atividades':
            renderizarModuloGenerico(container, 'Agenda de Atividades', 'atividades', [
                { name: 'titulo', placeholder: 'Título da Palestra' },
                { name: 'palestrante', placeholder: 'Nome do Palestrante' },
                { name: 'horario', placeholder: 'Horário (ex: 14:00)' },
                { name: 'vagas', placeholder: 'Vagas', type: 'number' }
            ]);
            break;
        case 'projetos':
            renderizarModuloGenerico(container, 'Submissão de Projetos', 'projetos', [
                { name: 'titulo', placeholder: 'Título do Projeto' },
                { name: 'integrantes', placeholder: 'Integrantes' },
                { name: 'repositorio', placeholder: 'Link do Repositório (GitHub)' }
            ]);
            break;
        case 'chamados':
            renderizarModuloGenerico(container, 'Suporte T.I. & Dúvidas', 'chamados', [
                { name: 'solicitante', placeholder: 'Seu Nome' },
                { name: 'descricao', placeholder: 'Descrição do Problema' },
                { name: 'categoria', placeholder: 'Categoria (Rede, Audio, etc)' }
            ]);
            break;
        case 'feedbacks':
            renderizarModuloGenerico(container, 'Avaliações e Feedback', 'feedbacks', [
                { name: 'atividade_id', placeholder: 'ID da Atividade', type: 'number' },
                { name: 'nota', placeholder: 'Nota (1 a 5)', type: 'number' },
                { name: 'comentario', placeholder: 'Comentário' }
            ]);
            break;
        case 'inscricoes':
            renderizarModuloGenerico(container, 'Inscrições em Atividades', 'inscricoes', [
                { name: 'usuario_id', placeholder: 'ID do Usuário', type: 'number' },
                { name: 'atividade_id', placeholder: 'ID da Atividade', type: 'number' }
            ]);
            break;
    }
}

// Renderizador específico para Participantes (Módulo 1) com comunicação REST completa
async function renderizarModuloUsuarios(container) {
    container.innerHTML = `
        <div class="card">
            <h2>Módulo 1: Gestão de Participantes</h2>
            <form id="form-usuario">
                <input type="text" id="nome" placeholder="Nome Completo" required>
                <input type="email" id="email" placeholder="E-mail" required>
                <input type="text" id="curso" placeholder="Curso" required>
                <input type="text" id="matricula" placeholder="Matrícula" required>
                <select id="status">
                    <option value="Ativo">Ativo</option>
                    <option value="Pendente">Pendente</option>
                </select>
                <button type="submit" class="btn-submit">Cadastrar Participante</button>
            </form>
        </div>
        <div class="card">
            <h3>Lista de Inscritos</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Curso</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody id="tabela-usuarios"></tbody>
            </table>
        </div>
    `;

    carregarUsuarios();

    document.getElementById('form-usuario').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            curso: document.getElementById('curso').value,
            matricula: document.getElementById('matricula').value,
            status: document.getElementById('status').value
        };

        await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        carregarUsuarios();
        e.target.reset();
    });
}

async function carregarUsuarios() {
    const res = await fetch(`${API_URL}/usuarios`);
    const dados = await res.json();
    const tbody = document.getElementById('tabela-usuarios');
    if(!tbody) return;
    
    tbody.innerHTML = dados.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.curso}</td>
            <td><span class="badge">${u.status}</span></td>
            <td><button onclick="deletarRegistro('usuarios', ${u.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}

// Renderizador genérico dinâmico para os demais módulos
async function renderizarModuloGenerico(container, tituloModulo, endpoint, campos) {
    const inputsHtml = campos.map(c => `<input type="${c.type || 'text'}" id="${c.name}" placeholder="${c.placeholder}" required>`).join('');
    
    container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2>
            <form id="form-generico">
                ${inputsHtml}
                <select id="status">
                    <option value="Ativo">Ativo / Aprovado</option>
                    <option value="Pendente">Pendente</option>
                </select>
                <button type="submit" class="btn-submit">Salvar Registro</button>
            </form>
        </div>
        <div class="card">
            <h3>Registros Existentes</h3>
            <table>
                <thead id="thead-generico"></thead>
                <tbody id="tbody-generico"></tbody>
            </table>
        </div>
    `;

    carregarDadosGenericos(endpoint);

    document.getElementById('form-generico').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {};
        campos.forEach(c => {
            const val = document.getElementById(c.name).value;
            payload[c.name] = c.type === 'number' ? Number(val) : val;
        });
        payload.status = document.getElementById('status').value;

        await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        carregarDadosGenericos(endpoint);
        e.target.reset();
    });
}

async function carregarDadosGenericos(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    const dados = await res.json();
    const tbody = document.getElementById('tbody-generico');
    const thead = document.getElementById('thead-generico');
    if(!tbody || !dados.length) {
        if(tbody) tbody.innerHTML = `<tr><td colspan="10">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    const chaves = Object.keys(dados[0]);
    thead.innerHTML = `<tr>${chaves.map(k => `<th>${k.toUpperCase()}</th>`).join('')}<th>AÇÕES</th></tr>`;
    
    tbody.innerHTML = dados.map(item => `
        <tr>
            ${chaves.map(k => `<td>${item[k]}</td>`).join('')}
            <td><button onclick="deletarRegistro('${endpoint}', ${item.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}

async function deletarRegistro(endpoint, id) {
    await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
    if(endpoint === 'usuarios') carregarUsuarios();
    else carregarDadosGenericos(endpoint);
}