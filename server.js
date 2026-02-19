const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./economia.db');

// Create database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            saldo REAL DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_user INTEGER,
            to_user INTEGER,
            amount REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

app.post('/users', (req, res) => {
    const { nome } = req.body;

    db.run(
        `INSERT INTO users (nome, saldo) VALUES (?, 0)`,
        [nome],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ id: this.lastID, nome, saldo: 0 });
        }
    );
});

app.get('/users/:id', (req, res) => {
    db.get(
        `SELECT * FROM users WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: "Usuário não encontrado" });

            res.json(row);
        }
    );
});

app.post('/users/:id/add', (req, res) => {
    const { amount } = req.body;

    db.run(
        `UPDATE users SET saldo = saldo + ? WHERE id = ?`,
        [amount, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0)
                return res.status(404).json({ error: "Usuário não encontrado" });

            res.json({ message: "Saldo adicionado com sucesso" });
        }
    );
});

app.post('/transfer', (req, res) => {
    const { from, to, amount } = req.body;

    db.serialize(() => {
        db.get(`SELECT saldo FROM users WHERE id = ?`, [from], (err, sender) => {
            if (!sender || sender.saldo < amount)
                return res.status(400).json({ error: "Saldo insuficiente" });

            db.run(`UPDATE users SET saldo = saldo - ? WHERE id = ?`, [amount, from]);
            db.run(`UPDATE users SET saldo = saldo + ? WHERE id = ?`, [amount, to]);

            db.run(
                `INSERT INTO transactions (from_user, to_user, amount)
                 VALUES (?, ?, ?)`,
                [from, to, amount]
            );

            res.json({ message: "Transferência realizada" });
        });
    });
});

app.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});
