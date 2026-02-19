const db = require('../../database');

module.exports = (req, res) => {
    db.all(`SELECT * FROM users ORDER BY saldo DESC`, [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(users);
    });
};
