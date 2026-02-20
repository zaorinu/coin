const db = require('../../utils/database');

module.exports = (req, res) => {
    const { name } = req.body;

    if (!name)
        return res.status(400).json({ error: "Name is required" });

    db.run(
        `INSERT INTO users (name) VALUES (?)`,
        [name],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: this.lastID,
                name,
                balance: 0
            });
        }
    );
};
