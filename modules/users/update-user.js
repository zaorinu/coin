const db = require('../../utils/database');

module.exports = (req, res) => {
    const { nome } = req.body;
    const userId = req.params.id;

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    db.run(
        `UPDATE users SET nome = ? WHERE id = ?`,
        [nome, userId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Usuário não encontrado" });

            db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err2, user) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: "Usuário atualizado", user });
            });
        }
    );
};
