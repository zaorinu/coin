const db = require('../../database');

module.exports = (req, res) => {
    const { from, to, amount } = req.body;

    if (!from || !to || amount <= 0)
        return res.status(400).json({ error: "Dados inválidos" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.get(`SELECT saldo FROM users WHERE id = ?`, [from], (err, sender) => {
            if (!sender || sender.saldo < amount) {
                db.run("ROLLBACK");
                return res.status(400).json({ error: "Saldo insuficiente" });
            }

            db.run(`UPDATE users SET saldo = saldo - ? WHERE id = ?`, [amount, from]);
            db.run(`UPDATE users SET saldo = saldo + ? WHERE id = ?`, [amount, to]);

            db.run(
                `INSERT INTO transactions 
                 (type, from_user, to_user, amount, status)
                 VALUES ('transfer', ?, ?, ?, 'completed')`,
                [from, to, amount]
            );

            db.run("COMMIT");
            res.json({ message: "Transferência realizada" });
        });
    });
};
