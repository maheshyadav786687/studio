
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const { join } = require("path");

const db = new sqlite3.Database(join(__dirname, "database.db"), (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

fs.readFile(join(__dirname, "schema.sql"), "utf8", (err, schema) => {
  if (err) {
    console.error("Error reading schema file:", err.message);
    db.close();
    return;
  }

  // Split schema into individual statements
  const statements = schema.split(/;\s*$/m);

  db.serialize(() => {
    // Execute each statement individually
    statements.forEach((statement) => {
      if (statement.trim() !== "") {
        // Modify the statement to include IF NOT EXISTS
        const modifiedStatement = statement.replace(
          /CREATE TABLE (?!IF NOT EXISTS)/g,
          "CREATE TABLE IF NOT EXISTS "
        );
        db.run(modifiedStatement, (err) => {
          if (err) {
            console.error("Error executing statement:", err.message);
          }
        });
      }
    });

    console.log("Schema applied successfully.");
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Closed the database connection.");
    });
  });
});
