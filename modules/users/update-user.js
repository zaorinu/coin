const db = require('../../utils/database');

module.exports = (req, res) => {
    const { name } = req.body;
    const userId = req.params.id;

    if (!name) return res.status(400).json({ error: "You need to specify a name" });

    db.run(
        `UPDATE users SET name = ? WHERE id = ?`,
        [name, userId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "User not found" });

            db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err2, user) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: "User updated", user });
            });
        }
    );
};
