const db = require('../../database');

module.exports = (req, res) => {
    db.get(
        `SELECT saldo FROM users WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row)
                return res.status(404).json({ error: "Usuário não encontrado" });

            res.json({ saldo: row.saldo });
        }
    );
};
