// Importação dos módulos específicos de cada dupla/seção
import { renderizarModuloParticipantes } from './modules/participantes.js';
import { renderizarModuloAtividades } from './modules/atividades.js';
import { renderizarModuloInscricoes } from './modules/inscricoes.js';
import { renderizarModuloFeedbacks } from './modules/feedbacks.js';
import { renderizarModuloChamados } from './modules/chamados.js';
import { renderizarModuloProjetos } from './modules/projetos.js';

const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarModuloPorNome('usuarios');

    document.querySelectorAll('.sidebar nav button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.sidebar nav button').forEach(btn => btn.classList.remove('active'));
            const btnClicado = e.currentTarget;
            btnClicado.classList.add('active');

            const modulo = btnClicado.getAttribute('data-modulo');
            carregarModuloPorNome(modulo);
        });
    });
});

// Função centralizadora de roteamento dos módulos
function carregarModuloPorNome(modulo) {
    const container = document.getElementById('conteudo-principal');

    switch (modulo) {
        case 'usuarios': renderizarModuloParticipantes(container, 'Gestão de Participantes');
            break;
        case 'atividades': renderizarModuloAtividades(container, 'Agenda de Atividades');
            break;
        case 'inscricoes': renderizarModuloInscricoes(container, 'Gerenciar Inscrições');
            break;
        case 'projetos': renderizarModuloProjetos(container, 'Gerenciar Projetos');
            break;
        case 'chamados': renderizarModuloChamados(container, 'Gerenciar Chamados');
            break;
        case 'feedbacks': renderizarModuloFeedbacks(container, 'Feedbacks');
            break;
    }
}