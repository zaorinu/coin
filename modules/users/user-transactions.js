const db = require('../../database');

module.exports = (req, res) => {
    db.all(
        `SELECT * FROM transactions
         WHERE from_user = ? OR to_user = ?
         ORDER BY created_at DESC`,
        [req.params.id, req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};
