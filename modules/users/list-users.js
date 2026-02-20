const db = require('../../utils/database');

module.exports = (req, res) => {
    db.all(`SELECT * FROM users ORDER BY balance DESC`, [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(users);
    });
};
