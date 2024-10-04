import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketIo } from "./src/utils/chat/socket.js";

dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://carrotfe10011341.fly.dev",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

socketIo(io);

const port = process.env.SOCKET_PORT || 5001;
httpServer.listen(port, () => {
  console.log("server listening on port", port);
});
