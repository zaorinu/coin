const db = require('../../utils/database');

module.exports = (req, res) => {
    db.get(
        `SELECT * FROM users WHERE id = ?`,
        [req.params.id],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user)
                return res.status(404).json({ error: "Usuário não encontrado" });

            res.json(user);
        }
    );
};
