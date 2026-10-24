const API_URL = 'http://localhost:3000/api';
import { deletarRegistro } from '../app.js';

export async function renderizarModuloProjetos(container, tituloModulo) {
    container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2>
            <form id="form-projeto">
                <input type="text" id="titulo" placeholder="Título do Projeto" required>
                <input type="text" id="integrantes" placeholder="Integrantes Responsáveis" required>
                <input type="text" id="repositorio" placeholder="Link do Repositório" required>
                <select id="status">
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                </select>
                <button type="submit" class="btn-submit">Cadastrar Projeto</button>
            </form>
        </div>
        <div class="card">
            <h3>Lista de Projetos</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Integrantes</th>
                        <th>Repositório</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="tabela-projetos"></tbody>
            </table>
        </div>
    `;

    carregarProjetos();

    window.deletarProjetoGlobal = async function (id) {
        const sucesso = await deletarRegistro('projetos', id);
        if (sucesso) {
            carregarProjetos(); // Atualiza a tabela se a exclusão deu certo
        }
    };

    document.getElementById('form-projeto').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            titulo: document.getElementById('titulo').value,
            integrantes: document.getElementById('integrantes').value,
            repositorio: document.getElementById('repositorio').value,
            status: document.getElementById('status').value
        };

        await fetch(`${API_URL}/projetos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        carregarProjetos();
        e.target.reset();
    });
}

async function carregarProjetos() {
    const res = await fetch(`${API_URL}/projetos`);
    const dados = await res.json();
    const tbody = document.getElementById('tabela-projetos');
    
    if (!tbody) return;

    tbody.innerHTML = dados.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.integrantes}</td>
            <td><a href="${p.repositorio}" target="_blank">Repositório</a></td>
            <td><span class="badge">${p.status}</span></td>
            <td><button onclick="deletarProjetoGlobal(${p.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}