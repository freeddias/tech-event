const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./techevent.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        curso TEXT NOT NULL,
        matricula TEXT NOT NULL,
        status TEXT DEFAULT 'Ativo'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS atividades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        palestrante TEXT NOT NULL,
        horario TEXT NOT NULL,
        vagas INTEGER NOT NULL,
        status TEXT DEFAULT 'Ativo'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS inscricoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        atividade_id INTEGER,
        data_hora TEXT,
        status TEXT DEFAULT 'Confirmado'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS projetos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        integrantes TEXT NOT NULL,
        repositorio TEXT NOT NULL,
        status TEXT DEFAULT 'Pendente'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS chamados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        solicitante TEXT NOT NULL,
        descricao TEXT NOT NULL,
        categoria TEXT NOT NULL,
        status TEXT DEFAULT 'Aberto'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        atividade_id INTEGER,
        nota INTEGER NOT NULL,
        comentario TEXT,
        status TEXT DEFAULT 'Publicado'
    )`);
});

// ==========================================
// ROTAS DA API REST
// ==========================================

app.get('/api/usuarios', (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/usuarios', (req, res) => {
    const { nome, email, curso, matricula, status } = req.body;
    if (!nome || !email || !curso || !matricula) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }
    const sql = `INSERT INTO usuarios (nome, email, curso, matricula, status) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nome, email, curso, matricula, status || 'Ativo'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, email, curso, matricula, status: status || 'Ativo' });
    });
});

app.delete('/api/usuarios/:id', (req, res) => {
    db.run(`DELETE FROM usuarios WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});


app.get('/api/atividades', (req, res) => {
    db.all("SELECT * FROM atividades", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/atividades', (req, res) => {
    const { titulo, palestrante, horario, vagas, status } = req.body;
    const sql = `INSERT INTO atividades (titulo, palestrante, horario, vagas, status) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [titulo, palestrante, horario, vagas, status || 'Ativo'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, titulo, palestrante, horario, vagas, status: status || 'Ativo' });
    });
});

app.delete('/api/atividades/:id', (req, res) => {
    db.run(`DELETE FROM atividades WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.get('/api/inscricoes', (req, res) => {
    db.all("SELECT * FROM inscricoes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/inscricoes', (req, res) => {
    const { usuario_id, atividade_id, data_hora, status } = req.body;
    const sql = `INSERT INTO inscricoes (usuario_id, atividade_id, data_hora, status) VALUES (?, ?, ?, ?)`;
    db.run(sql, [usuario_id, atividade_id, data_hora || new Date().toISOString(), status || 'Confirmado'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, usuario_id, atividade_id, status: status || 'Confirmado' });
    });
});

app.get('/api/projetos', (req, res) => {
    db.all("SELECT * FROM projetos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/projetos', (req, res) => {
    const { titulo, integrantes, repositorio, status } = req.body;
    const sql = `INSERT INTO projetos (titulo, integrantes, repositorio, status) VALUES (?, ?, ?, ?)`;
    db.run(sql, [titulo, integrantes, repositorio, status || 'Pendente'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, titulo, integrantes, repositorio, status: status || 'Pendente' });
    });
});

app.get('/api/chamados', (req, res) => {
    db.all("SELECT * FROM chamados", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/chamados', (req, res) => {
    const { solicitante, descricao, categoria, status } = req.body;
    const sql = `INSERT INTO chamados (solicitante, descricao, categoria, status) VALUES (?, ?, ?, ?)`;
    db.run(sql, [solicitante, descricao, categoria, status || 'Aberto'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, solicitante, descricao, categoria, status: status || 'Aberto' });
    });
});

app.get('/api/feedbacks', (req, res) => {
    db.all("SELECT * FROM feedbacks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/feedbacks', (req, res) => {
    const { atividade_id, nota, comentario, status } = req.body;
    const sql = `INSERT INTO feedbacks (atividade_id, nota, comentario, status) VALUES (?, ?, ?, ?)`;
    db.run(sql, [atividade_id, nota, comentario, status || 'Publicado'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, atividade_id, nota, comentario, status: status || 'Publicado' });
    });
});
app.delete('/api/feedbacks/:id', (req, res) => {
    db.run(`DELETE FROM feedbacks WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} (http://localhost:${PORT})`);
});