const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./coins.app.db');

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            balance REAL NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            from_user INTEGER,
            to_user INTEGER,
            amount REAL NOT NULL,
            status TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(from_user) REFERENCES users(id),
            FOREIGN KEY(to_user) REFERENCES users(id)
        )
    `);
});

module.exports = db;
