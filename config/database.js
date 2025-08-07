const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "..", "urls.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log(`Connected to the SQLite database at ${dbPath}`);
});

const createTableSql = `
CREATE TABLE IF NOT EXISTS urls (
    shortCode TEXT PRIMARY KEY,
    originalUrl TEXT NOT NULL,
    createdAt TEXT NOT NULL
)`;

db.run(createTableSql, (err) => {
  if (err) {
    return console.error("Error creating table:", err.message);
  }
  console.log('Table "urls" is ready.');
});

module.exports = db;
