const db = require('../../utils/database');

module.exports = (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || amount <= 0) return res.status(400).json({ error: "Dados inválidos" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.get(`SELECT saldo FROM users WHERE id = ?`, [userId], (err, user) => {
            if (!user || user.saldo < amount) {
                db.run("ROLLBACK");
                return res.status(400).json({ error: "Saldo insuficiente" });
            }

            db.run(`UPDATE users SET saldo = saldo - ? WHERE id = ?`, [amount, userId]);
            db.run(
                `INSERT INTO transactions (type, from_user, amount, status) VALUES ('withdraw', ?, ?, 'completed')`,
                [userId, amount]
            );

            db.run("COMMIT");
            res.json({ message: "Saque realizado" });
        });
    });
};
