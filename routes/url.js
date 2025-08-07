const express = require("express");
const shortid = require("shortid");
const { URL } = require("url");
const Url = require("../models/Url");
const path = require("path");

const router = express.Router();

// Helper function for URL validation
const isValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

// @route   GET /
// @desc    Serve the main HTML page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// @route   POST /shorten
// @desc    Create a short URL
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Invalid URL provided." });
  }

  const shortCode = shortid.generate();

  try {
    // Check if the long URL already exists in the database
    let url = await Url.findOne({ originalUrl: longUrl });

    if (url) {
      // If it exists, return the existing short URL
      const shortUrl = `${baseUrl}/${url.shortCode}`;
      res.json({
        originalUrl: url.originalUrl,
        shortUrl: shortUrl,
        shortCode: url.shortCode,
      });
    } else {
      // If not, create a new entry
      const shortUrl = `${baseUrl}/${shortCode}`;

      url = new Url({
        originalUrl: longUrl,
        shortCode: shortCode,
      });

      await url.save();

      res.json({
        originalUrl: url.originalUrl,
        shortUrl: shortUrl, // Construct the full short URL for the response
        shortCode: url.shortCode,
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// @route   GET /:shortCode
// @desc    Redirect to the original long URL
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode: shortCode });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res
        .status(404)
        .sendFile(path.join(__dirname, "..", "views", "404.html"));
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
