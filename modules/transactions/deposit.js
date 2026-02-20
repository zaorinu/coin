const db = require('c');

module.exports = (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || amount <= 0) return res.status(400).json({ error: "Dados inválidos" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(
            `UPDATE users SET saldo = saldo + ? WHERE id = ?`,
            [amount, userId],
            function(err) {
                if (err || this.changes === 0) {
                    db.run("ROLLBACK");
                    return res.status(400).json({ error: "Usuário não encontrado" });
                }

                db.run(
                    `INSERT INTO transactions (type, to_user, amount, status) VALUES ('deposit', ?, ?, 'completed')`,
                    [userId, amount]
                );

                db.run("COMMIT");
                res.json({ message: "Depósito realizado" });
            }
        );
    });
};
