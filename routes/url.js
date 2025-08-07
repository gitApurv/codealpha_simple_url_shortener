const express = require("express");
const shortid = require("shortid");
const { URL } = require("url");
const db = require("../config/database");
const path = require("path");

const router = express.Router();

const isValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

// POST /shorten
// Create a short URL
router.post("/shorten", (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Invalid URL provided." });
  }

  const shortCode = shortid.generate();
  const shortUrl = `${baseUrl}/${shortCode}`;
  const createdAt = new Date().toISOString();

  const sql = `INSERT INTO urls (shortCode, originalUrl, createdAt) VALUES (?, ?, ?)`;
  db.run(sql, [shortCode, longUrl, createdAt], function (err) {
    if (err) {
      return res.status(500).json({ error: "Server error." });
    }
    res.json({
      originalUrl: longUrl,
      shortUrl: shortUrl,
      shortCode: shortCode,
    });
  });
});

// GET /:shortCode
// Redirect to the original long URL
router.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;

  const sql = `SELECT originalUrl FROM urls WHERE shortCode = ?`;
  db.get(sql, [shortCode], (err, row) => {
    if (err) {
      return res.status(500).send("Server Error");
    }
    if (row) {
      return res.redirect(row.originalUrl);
    } else {
      return res
        .status(404)
        .sendFile(path.join(__dirname, "..", "views", "404.html"));
    }
  });
});

module.exports = router;
