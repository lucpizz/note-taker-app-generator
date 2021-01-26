const fs = require("fs");
const path = require("path");
const noteData = require("../db/db.json");
const db = path.join(__dirname + "/../db/db.json");
const { v4: uuidv4 } = require("uuid");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  app.get("/api/notes", function (req, res) {
    fs.readFile(db, "utf-8", (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });

  app.post("/api/notes", (req, res) => {
    let new_note = req.body;
    new_note.id = uuidv4();
    fs.readFile(db, "utf-8", (err, data) => {
      let old = JSON.parse(data);
      old.push(new_note);
      fs.writeFile(db, JSON.stringify(old), (err, data) => {
        res.json({ data: old });
      });
    });
  });

  app.delete("/api/notes/:id", function (req, res) {
    let note_id = req.params.id;
    fs.readFile(db, "utf-8", (err, data) => {
      let old_data = JSON.parse(data);
      // Iterate through Old data. Remove the note with the ID given
      old_data.splice(note_id, 1);
      fs.writeFile(db, JSON.stringify(old_data), (err, data) => {
        res.json({ data: old_data });
      });
    });
  });
};
