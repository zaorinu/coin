const db = require('../../utils/database');

module.exports = (req, res) => {
    db.all(`SELECT * FROM transactions ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};
