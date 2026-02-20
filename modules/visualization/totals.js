const db = require('../../utils/database');

module.exports = (req, res) => {
    const userId = req.params.userId;

    db.get(
        `SELECT
            COALESCE(SUM(CASE WHEN to_user = ? THEN amount ELSE 0 END), 0) AS totalRecebido,
            COALESCE(SUM(CASE WHEN from_user = ? THEN amount ELSE 0 END), 0) AS totalEnviado
         FROM transactions`,
        [userId, userId],
        (err, totals) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(totals);
        }
    );
};
