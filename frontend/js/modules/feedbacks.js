const API_URL = 'http://localhost:3000/api';
import { deletarRegistro } from '../app.js';

export async function renderizarModuloFeedbacks(container, tituloModulo) {
    container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2>
            <form id="form-feedback">
                <input type="number" id="atividade_id" placeholder="ID da Atividade" required>
                
                <!-- Seleção por Estrelas (Começa sem marcações e mais escura) -->
                <div class="grupo-estrelas" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Avaliação:</label>
                    <div class="estrellas-container" style="display: flex; gap: 8px; font-size: 24px; cursor: pointer;">
                        <label style="filter: grayscale(100%) brightness(0.6); transition: filter 0.2s;"><input type="radio" name="nota" value="1" required style="display:none;"> ⭐</label>
                        <label style="filter: grayscale(100%) brightness(0.6); transition: filter 0.2s;"><input type="radio" name="nota" value="2" style="display:none;"> ⭐</label>
                        <label style="filter: grayscale(100%) brightness(0.6); transition: filter 0.2s;"><input type="radio" name="nota" value="3" style="display:none;"> ⭐</label>
                        <label style="filter: grayscale(100%) brightness(0.6); transition: filter 0.2s;"><input type="radio" name="nota" value="4" style="display:none;"> ⭐</label>
                        <label style="filter: grayscale(100%) brightness(0.6); transition: filter 0.2s;"><input type="radio" name="nota" value="5" style="display:none;"> ⭐</label>
                    </div>
                    <span id="texto-nota" style="font-size: 14px; color: #666; margin-top: 5px; display: block;">Selecione uma nota</span>
                </div>

                <textarea id="comentario" placeholder="Comentário ou Observação" rows="3" required></textarea>
                <select id="status">
                    <option value="Publicado">Publicado</option>
                    <option value="Pendente">Pendente</option>
                </select>
                <button type="submit" class="btn-submit">Enviar Feedback</button>
            </form>
        </div>
        <div class="card">
            <h3>Lista de Feedbacks</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Atividade ID</th><th>Nota</th><th>Comentário</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody id="tabela-feedbacks"></tbody>
            </table>
        </div>
    `;

    carregarFeedbacks();

    // Lógica para alternar o brilho/cor das estrelas dinamicamente
    const labelsEstrelas = container.querySelectorAll('.estrellas-container label');
    labelsEstrelas.forEach((label, index) => {
        const radio = label.querySelector('input[type="radio"]');
        
        label.addEventListener('click', () => {
            radio.checked = true;
            document.getElementById('texto-nota').innerText = `Nota selecionada: ${radio.value} estrela(s)`;
            
            // Pinta as clicadas e as anteriores (remove o filtro cinza/escuro), e escurece o restante
            labelsEstrelas.forEach((l, i) => {
                if (i <= index) {
                    l.style.filter = 'none'; // Amarela/original
                } else {
                    l.style.filter = 'grayscale(100%) brightness(0.6)'; // Escura
                }
            });
        });
    });

    window.deletarUsuarioGlobal = async function (id) {
        const sucesso = await deletarRegistro('feedbacks', id);
        if (sucesso) {
            carregarFeedbacks(); // Atualiza a tabela se a exclusão deu certo
        }
    };

    document.getElementById('form-feedback').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const notaSelecionada = document.querySelector('input[name="nota"]:checked');

        const payload = {
            atividade_id: Number(document.getElementById('atividade_id').value),
            nota: notaSelecionada ? Number(notaSelecionada.value) : 0,
            comentario: document.getElementById('comentario').value,
            status: document.getElementById('status').value
        };

        await fetch(`${API_URL}/feedbacks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        carregarFeedbacks();
        e.target.reset();
        
        // Reseta o visual das estrelas e o texto informativo após o envio
        labelsEstrelas.forEach(l => {
            l.style.filter = 'grayscale(100%) brightness(0.6)';
        });
        document.getElementById('texto-nota').innerText = 'Selecione uma nota';
    });
}

export async function carregarFeedbacks() {
    const res = await fetch(`${API_URL}/feedbacks`);
    const dados = await res.json();
    const tbody = document.getElementById('tabela-feedbacks');
    if (!tbody) return;

    tbody.innerHTML = dados.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.atividade_id}</td>
            <td>${'⭐'.repeat(f.nota)} (${f.nota})</td>
            <td>${f.comentario}</td>
            <td><span class="badge">${f.status}</span></td>
            <td><button onclick="deletarUsuarioGlobal(${f.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}