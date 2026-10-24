const API_URL = 'http://localhost:3000/api';
export async function renderizarModuloFeedbacks(container, tituloModulo) {
    container.innerHTML = `
        <div class="card">
            <h2>${tituloModulo}</h2>
            <form id="form-feedback">
                <input type="number" id="atividade_id" placeholder="ID da Atividade" required>
                <input type="number" id="nota" placeholder="Nota (1 a 5)" min="1" max="5" required>
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

    document.getElementById('form-feedback').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            atividade_id: Number(document.getElementById('atividade_id').value),
            nota: Number(document.getElementById('nota').value),
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
            <td>${f.nota}</td>
            <td>${f.comentario}</td>
            <td><span class="badge">${f.status}</span></td>
            <td><button onclick="deletarRegistro('feedbacks', ${f.id})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button></td>
        </tr>
    `).join('');
}