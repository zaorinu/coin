const db = require('../../utils/database');

module.exports = (req, res) => {
    const { nome } = req.body;

    if (!nome)
        return res.status(400).json({ error: "Nome é obrigatório" });

    db.run(
        `INSERT INTO users (nome) VALUES (?)`,
        [nome],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: this.lastID,
                nome,
                saldo: 0
            });
        }
    );
};
