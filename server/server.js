require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const { handleWebSocketConnection } = require("./controllers/resumeController");

const app = express();
const port = process.env.PORT || 4000;

// Connect to database
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/resume", resumeRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", handleWebSocketConnection);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
