const API_URL = 'http://localhost:3000/api';
import { deletarRegistro } from '../app.js';
export async function renderizarModuloParticipantes(container, tituloModulo) {
    container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2> <!-- Título limpo, sem "Módulo 1: " -->
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
    window.deletarUsuarioGlobal = async function (id) {
        const sucesso = await deletarRegistro('usuarios', id);
        if (sucesso) {
            carregarUsuarios(); // Atualiza a tabela se a exclusão deu certo
        }
    };


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
    if (!tbody) return;
    tbody.innerHTML = dados.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.curso}</td>
            <td><span class="badge">${u.status}</span></td>
            <td><button onclick="deletarUsuarioGlobal(${u.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}
