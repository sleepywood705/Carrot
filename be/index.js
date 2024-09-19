import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

import ioUtils from "./src/utils/io/io.js";
ioUtils(io);

const port = process.env.PORT || 5001;
httpServer.listen(port, () => {
  console.log("server listening on port", port);
});