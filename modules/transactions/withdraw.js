const db = require('../../utils/database');

module.exports = (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || amount <= 0) return res.status(400).json({ error: "Invalid data" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.get(`SELECT balance FROM users WHERE id = ?`, [userId], (err, user) => {
            if (!user) {
                db.run("ROLLBACK");
                return res.status(404).json({ error: "User not found" });
            }

            if (user.balance < amount) {
                db.run("ROLLBACK");
                return res.status(400).json({ error: "Insufficient balance" });
            }

            db.run(`UPDATE users SET balance = balance - ? WHERE id = ?`, [amount, userId]);
            db.run(
                `INSERT INTO transactions (type, from_user, amount, status) VALUES ('withdraw', ?, ?, 'completed')`,
                [userId, amount]
            );

            db.run("COMMIT");
            res.status(201).json({ message: "Withdrawal completed" });
        });
    });
};
