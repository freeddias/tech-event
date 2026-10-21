# 🚀 TechEvent - Sistema Integrado de Gestão de Eventos Acadêmicos & Tech

![TechEvent Banner](https://img.shields.io/badge/status-em_desenvolvimento-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?style=for-the-badge&logo=tailwindcss)

---

## 👨‍💻 Autoria e Concepção

* **Turma de Desenvolvimento:** **Turma 0128**
* **Instituição:** SENAC Minas Gerais
* **Curso / Disciplina:** Técnico em Informática / UC9, UC-10, UC-13 e UC-15 
* **Ano:** 2026
* **Desenvolvedores envolvidos:**

---

## 📌 Sobre o Projeto

O **TechEvent** é uma plataforma web completa para gestão de simpósios, conferências e hackathons acadêmicos. O sistema foi projetado sob a arquitetura de **Monolito Modular com API RESTful**, garantindo alta coesão, desacoplamento de código no front-end por meio de Módulos ES6 e facilidade na adição de novas funcionalidades.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **HTML5 & CSS3** (com variáveis customizadas para visual escuro/industrial).
* **Tailwind CSS** (via CDN para utilitários e layouts).
* **JavaScript ES6+ Vanilla** (Módulos nativos com `import`/`export` sem bundlers pesados).
* **Chart.js** (Visualização de métricas e gráficos interativos no Dashboard).
* **FontAwesome 6** (Iconografia).
* **Fontes:** *Syne* (Títulos/Branding) e *Outfit* (Interface do Usuário).

### **Back-end (API RESTful)**
* **Node.js** com **Express**.
* Architecture baseada em rotas organizadas por módulos.
* Comunicação via formato **JSON**.

---

## 🧩 Estrutura de Módulos do Sistema

O projeto é dividido em **6 módulos centrais**, desenvolvidos e integrados cooperativamente:

| # | Módulo | Descrição & Responsabilidade Back-end | Interface Front-end |
|---|---|---|---|
| **01** | **Participantes (Usuários)** | CRUD de inscritos, controle de papéis e validações. | Listagem, busca avançada e formulário de cadastro. |
| **02** | **Agenda de Atividades** | Gestão de palestras, minicursos, salas e palestrantes. | Grade interativa de horários e modais informativos. |
| **03** | **Inscrições no Evento** | Controle de vagas por palestra e prevenção de conflitos. | Fluxo de reserva e emissão de comprovantes. |
| **04** | **Submissão de Projetos** | Gestão de equipes e projetos do Hackathon. | Formulário de submissão, repositórios e ranking. |
| **05** | **Suporte T.I. & Chamados** | Abertura e triagem de ocorrências técnicas no evento. | Central de ajuda com badges de status de atendimento. |
| **06** | **Avaliações & Feedbacks** | Coleta de notas (1 a 5 estrelas) e métricas de satisfação. | Formulário de opinião e gráficos consolidados. |

---

## 📁 Estrutura de Diretórios

```text
tech-event/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── modules/
│   │   │   ├── usuarios.js
│   │   │   ├── atividades.js
│   │   │   ├── inscricoes.js
│   │   │   ├── projetos.js
│   │   │   ├── chamados.js
│   │   │   └── avaliacao.js
│   │   └── app.js
│   ├── dashboard.html
│   └── index.html
├── fonts/
│   ├── syne-latin.woff2
│   └── outfit-latin.woff2
└── README.md
```

---

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
* [Node.js](https://nodejs.org/) instalado (v18 ou superior).
* Extensão **Live Server** no VS Code (ou qualquer servidor HTTP local).

---

### **1. Configurando o Back-end (API)**

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run dev # ou node src/server.js
```
> O servidor iniciará por padrão em `http://localhost:3000`.

---

### **2. Executando o Front-end**

> ⚠️ **Atenção:** Devido ao uso de **ES6 Modules** (`type="module"`), o projeto não deve ser aberto diretamente dando duplo clique nos arquivos `.html` (protocolo `file://`).

1. Abra a pasta do projeto no **VS Code**.
2. Clique com o botão direito no arquivo `frontend/index.html` ou `frontend/dashboard.html`.
3. Selecione **"Open with Live Server"**.
4. Acesse pelo navegador na porta indicada (ex: `http://127.0.0.1:5500/frontend/dashboard.html`).

---

## 🛠️ Boas Práticas e Resolução de Problemas Comuns

* **Importações ES6 com extensão:** No JavaScript nativo, todas as importações dentro de módulos devem conter explicitamente a extensão `.js`:
  ```javascript
  // ❌ Errado:
  import { renderizarModuloFeedbacks } from "./modules/avaliacao";

  // ✅ Correto:
  import { renderizarModuloFeedbacks } from "./modules/avaliacao.js";
  ```

* **Escopo em Módulos:** Módulos ES6 não expõem funções diretamente no escopo global (`window`). Para evitar o erro `function is not defined` ao usar eventos no HTML:
  * Utilize `addEventListener` programmaticamente no JavaScript (`app.js`), associando os eventos com atributos `data-modulo`.
  * Caso prefira manipuladores HTML inline (`onclick`), anexe explicitamente a função ao objeto `window`: `window.minhaFuncao = ...`.

---

## 📜 Licença

Este projeto é de uso educacional e acadêmico, desenvolvido para fins de aprendizagem e avaliação institucional no **SENAC MG**.
