const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 5000 || process.env.base;
const db = require("./DB");
const roomRoutes = require("./Routes/roomRoutes");

const app = express();

async function startServer() {
  try {
    // Connect to the database
     await db;

    app.use(express.json());
    app.use(cors());
    app.get("/", (req, res) => {
      res.send("Welcome to Angle-Eyes server");
    });
    app.use("/room", roomRoutes);

    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
