const express = require("express");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");

const app = express();
const port = 3000;
const host = "0.0.0.0";

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/events", eventRoutes);

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});