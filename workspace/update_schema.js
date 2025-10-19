
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { join } = require('path');

const db = new sqlite3.Database(join(__dirname, 'database.db'), (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

const schema = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error("Error executing schema:", err.message);
  }
  console.log("Schema applied successfully.");
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
});
