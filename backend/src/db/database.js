
const initSqlJs = require('sql.js');
const path      = require('path');
const fs        = require('fs');

const DATA_DIR = path.join(__dirname, '../../../data');
const DB_PATH  = path.join(DATA_DIR, 'projectmanager.db');

let db = null;

async function getDb() {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  runMigrations();
  persist();
  return db;
}

function runMigrations() {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER  PRIMARY KEY AUTOINCREMENT,
      name        TEXT     NOT NULL,
      description TEXT,
      created_at  DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER  PRIMARY KEY AUTOINCREMENT,
      project_id  INTEGER  NOT NULL,
      title       TEXT     NOT NULL,
      description TEXT,
      status      TEXT     NOT NULL DEFAULT 'todo'
                           CHECK(status   IN ('todo', 'in-progress', 'done')),
      priority    TEXT     NOT NULL DEFAULT 'medium'
                           CHECK(priority IN ('low', 'medium', 'high')),
      due_date    DATE,
      created_at  DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );
  `);
}

function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function queryAll(sql, params = []) {
  const stmt    = db.prepare(sql);
  const results = [];
  stmt.bind(params);
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  const idRow = queryOne('SELECT last_insert_rowid() AS id');
  persist();
  return { lastInsertRowid: idRow ? idRow.id : null };
}

module.exports = { getDb, queryAll, queryOne, run };
