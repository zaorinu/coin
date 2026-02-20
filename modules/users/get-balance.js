const db = require('../../utils/database');

module.exports = (req, res) => {
    db.get(
        `SELECT balance FROM users WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row)
                return res.status(404).json({ error: "User not found" });

            res.json({ balance: row.balance });
        }
    );
};
