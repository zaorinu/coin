const db = require('../../database');

module.exports = (req, res) => {
    db.all(
        `SELECT t.id, t.type, t.from_user, t.to_user, t.amount, t.status, t.created_at,
                u1.nome as from_name, u2.nome as to_name
         FROM transactions t
         LEFT JOIN users u1 ON t.from_user = u1.id
         LEFT JOIN users u2 ON t.to_user = u2.id
         ORDER BY t.created_at DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};
