import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import initializeSocket from "./sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = initializeSocket(server);

app.set("io", io);

server.listen(PORT, () => {
  console.log(`Veyra server running on port ${PORT}`);
});