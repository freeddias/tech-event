import { deletarRegistro } from '../app.js';
const API_URL = 'http://localhost:3000/api';
export async function renderizarModuloInscricoes(container, tituloModulo) {
     container.innerHTML = `
    <h2>${tituloModulo}</h2>
    <div class="card">
    <form id="form-inscricoes">
  <input type="text" id="usuario_id" placeholder="Nome:"></input>
  <input type="text" id="atividade_id" placeholder="Atividade:"></input>
  <input type="text" id="data_hora" placeholder="Data da Inscrição"></input>
<select id="status">
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                 <button type="submit" class="btn-submit">Enviar Inscrição</button>
    </form>
    </div>
    <div class="card">
      <h3>Lista de Inscrições</h3>
      <table>
    <thead>
      <tr><th>ID</th><th>Usuário</th><th>Atividade</th><th>Data/Hora</th><th>Status</th><th>Ações</th></tr>
      </thead>
      <tbody id="tabela-inscricoes"></tbody>
      </table>
    </div>`
  carregarInscricoes()

   window.deletarInscricaoGlobal = async function (id) {
          const sucesso = await deletarRegistro('inscricoes', id);
          if (sucesso) {
              carregarInscricoes(); 
          }
      };

  
      document.getElementById('form-inscricoes').addEventListener('submit', async (e) => {
              e.preventDefault();
              if(document.getElementById('usuario_id').value &&
              document.getElementById('atividade_id').value &&
              document.getElementById('data_hora').value &&
              document.getElementById('status').value
            ){

            
              const payload = {
                  usuario_id: document.getElementById('usuario_id').value,
                  atividade_id: document.getElementById('atividade_id').value,
                  data_hora: document.getElementById('data_hora').value,
                  status: document.getElementById('status').value
              };
              console.log(payload)
              await fetch(`${API_URL}/inscricoes`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
      
              carregarInscricoes();
              alert("Cadastro Realizado com Sucesso!")
              e.target.reset();
} else alert("Todos os campos precisam ser preenchidos!")
});

}






async function carregarInscricoes() {
 const res = await fetch(`${API_URL}/inscricoes`);
    const dados = await res.json();
    const tbody = document.getElementById('tabela-inscricoes');
    if (!tbody) return;

    tbody.innerHTML = dados.map(i => `
        <tr>
             <td>${i.id}</td>
            <td>${i.usuario_id}</td>
            <td>${i.atividade_id}</td>
            <td>${i.data_hora}</td>
            <td><span class="badge">${i.status}</span></td>
           <td><button onclick="deletarInscricaoGlobal(${i.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');

}
