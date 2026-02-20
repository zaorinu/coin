const express = require('express');
const app = express();
const db = require('./utils/database');

app.use(express.json());

app.use('/users', require('./modules/users'));
app.use('/transactions', require('./modules/transactions'));
app.use('/visualization', require('./modules/visualization'));

// Painel debug para Codespaces web
app.get('/debug/db', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, users) => {
        if (err) return res.status(500).send(err.message);
        db.all(`SELECT * FROM transactions`, [], (err2, txs) => {
            if (err2) return res.status(500).send(err2.message);
            res.send(`
                <h2>Usuários</h2>
                <pre>${JSON.stringify(users, null, 2)}</pre>
                <h2>Transações</h2>
                <pre>${JSON.stringify(txs, null, 2)}</pre>
            `);
        });
    });
});

app.listen(3000, () => console.log("🔥 API rodando em http://localhost:3000"));
