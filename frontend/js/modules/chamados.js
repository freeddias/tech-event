const API_URL = 'http://localhost:3000/api';
import { deletarRegistro } from '../app.js';
export async function renderizarModuloChamados(container, tituloModulo) {
  // Todo o conteúdo da função deverá vir aqui.
  container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2>
            <form id="form-chamados">
                
                <input type="text" id="nome" placeholder="Nome do Solicitante" required>
                <textarea id="descricao" placeholder="Descrição Detalhada" rows="7" required></textarea>
                <select id="categoria">
                    <option value="" disabled selected hidden>Selecione um status...</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="infra">Infraestrutura</option>
                    <option value="duvida">Dúvida</option>
                </select>
                <select id="status">
                    <option value="" disabled selected hidden>Selecione um status...</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_at">Em Atendimento</option>
                    <option value="fechado">Fechado</option>
                </select>
                <button type="submit" class="btn-submit">Cadastrar Chamado</button>
            </form>
        </div>
        <div class="card">
            <h3>Lista de Chamados</h3>
            <table>
                <thead>
                    <th>id</th>
                    <th>Solicitante</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Ações</th>
                </thead>
                <tbody id="tabela-chamados"></tbody>
            </table>
        </div>
    `;







  carregarChamados();


  window.deletarChamadoGlobal = async function (id) {
    const sucesso = await deletarRegistro('chamados', id);
    if (sucesso) {
      carregarChamados(); // Atualiza a tabela se a exclusão deu certo
    }
  };


  document.getElementById('form-chamados').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      // chamado_id: Number(document.getElementById('chamado_id').value),
      solicitante: document.getElementById('nome').value,
      descricao: document.getElementById('descricao').value,
      categoria: document.getElementById('categoria').value,
      status: document.getElementById('status').value
    };
    console.log(payload)
    await fetch(`${API_URL}/chamados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    carregarChamados();
    e.target.reset();
  });



}
async function carregarChamados() {
  // Todo o conteúdo da função deverá vir aqui.

  const res = await fetch(`${API_URL}/chamados`);
  const dados = await res.json();
  const tbody = document.getElementById('tabela-chamados');
  if (!tbody) return;

  tbody.innerHTML = dados.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.solicitante}</td>
            <td>${f.descricao}</td>
            <td><span class="badge">${f.categoria}</span></td>
            <td><span class="badge">${f.status}</span></td>
            <td><button onclick="deletarChamadoGlobal(${f.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');



}