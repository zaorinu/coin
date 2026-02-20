const db = require('../../utils/database');

module.exports = (req, res) => {
    const userId = req.params.id;
    const { blocked } = req.body;

    if (blocked !== 0 && blocked !== 1) return res.status(400).json({ error: "Valor inválido, use 0 ou 1" });

    db.run(
        `UPDATE users SET blocked = ? WHERE id = ?`,
        [blocked, userId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Usuário não encontrado" });

            res.json({ message: `Usuário ${blocked ? 'bloqueado' : 'ativado'}` });
        }
    );
};
