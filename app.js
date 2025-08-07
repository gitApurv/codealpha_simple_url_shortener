const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const urlRoutes = require("./routes/url");

// Connect to the database
connectDB();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", urlRoutes);

// Handle 404 for any other route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Start the server
app.listen(port, () => {
  console.log("Server started.");
});
