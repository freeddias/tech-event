const API_URL = 'http://localhost:3000/api'
import { deletarRegistro } from '../app.js'
export async function renderizarModuloAtividades(container, tituloModulo) {
  container.innerHTML = `
      <div class='card'>
        <h2>${tituloModulo}</h2>
        <form id='form-atividade'>
          <input type='text' id='titulo' placeholder='Titulo da Atividade' required>
          <input type='text' id='palestrante' placeholder='Nome do palestrante/ministrante' required>
          <input type='text' id='horario' placeholder='Data e Horário da Atividade' required>
          <input type='number' id='vagas' placeholder='Quantidade de Vagas' required>
          <select id='status'>
            <option value='Ativo'>Ativo</option>
            <option value='Encerrado'>Encerrado</option>
            <option value='Cancelado'>Cancelado</option>
          </select>
          <button type='submit' class='btn-submit'>Cadastrar Atividade</button>
        </form>
      </div>
      <div class='card'>
        <h3>Lista de Atividades</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Palestrante</th>
              <th>Horário</th>
              <th>Vagas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id='tabela-atividades'></tbody>
        </table>
      </div>
    `
  carregarAtividades()
  window.deletarUsuarioGlobal = async function (id) {
    const sucesso = await deletarRegistro('atividades', id)
    if (sucesso) {
      carregarAtividades()
    }
  }
  document.getElementById('form-atividade').addEventListener('submit', async (e) => {
    e.preventDefault()
    const payload = {
      titulo: document.getElementById('titulo').value,
      palestrante: document.getElementById('palestrante').value,
      horario: document.getElementById('horario').value,
      vagas: document.getElementById('vagas').value,
      status: document.getElementById('status').value,
    }

    console.log(payload)
    await fetch(`${API_URL}/atividades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    carregarAtividades()
    e.target.reset()
  })
}

async function carregarAtividades() {
  const res = await fetch(`${API_URL}/atividades`)
  const dados = await res.json()
  const tbody = document.getElementById('tabela-atividades')
  if (!tbody) {
    return
  }
  tbody.innerHTML = dados.map((e) => `
    <tr>
    <td>${e.id}</td>
      <td>${e.titulo}</td>
      <td>${e.palestrante}</td>
      <td>${e.horario}</td>
      <td>${e.vagas}</td>
      <td><span class='badge'>${e.status}</span></td>
      <td><button onclick='deletarUsuarioGlobal(${e.id})' style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
    </tr>
  `).join('')
}
