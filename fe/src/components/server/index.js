const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // CORS 모듈 추가

const app = express();
app.use(cors()); // CORS 설정 추가

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('message', (msg) => {
    io.emit('message', msg); // 모든 클라이언트에 메시지 전송
  });
});

server.listen(3001, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3001');
  });