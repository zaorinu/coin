const db = require('../../database');

module.exports = (req, res) => {
    db.run(
        `DELETE FROM users WHERE id = ?`,
        [req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0)
                return res.status(404).json({ error: "Usuário não encontrado" });

            res.json({ message: "Usuário deletado" });
        }
    );
};
