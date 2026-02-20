const db = require('../../utils/database');

module.exports = (req, res) => {
    const { from, to, amount } = req.body;

    if (!from || !to || amount <= 0)
        return res.status(400).json({ error: "Invalid data" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.get(`SELECT balance FROM users WHERE id = ?`, [from], (err, sender) => {
            if (!sender || sender.balance < amount) {
                db.run("ROLLBACK");
                return res.status(400).json({ error: "Insufficient balance" });
            }

            db.run(`UPDATE users SET balance = balance - ? WHERE id = ?`, [amount, from]);
            db.run(`UPDATE users SET balance = balance + ? WHERE id = ?`, [amount, to]);

            db.run(
                `INSERT INTO transactions 
                 (type, from_user, to_user, amount, status)
                 VALUES ('transfer', ?, ?, ?, 'completed')`,
                [from, to, amount]
            );

            db.run("COMMIT");
            res.json({ message: "Transfer completed" });
        });
    });
};
