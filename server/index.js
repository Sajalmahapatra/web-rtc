const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Your React frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 3000;

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', (username) => {
    onlineUsers[socket.id] = username;

    // Send full updated user list to everyone
    io.emit('users', Object.values(onlineUsers));
    console.log('User logged in:', username);
  });

  socket.on('offer', (data) => {
    const toSocketId = getSocketIdByUsername(data.to);
    if (toSocketId) {
      io.to(toSocketId).emit('offer', {
        from: onlineUsers[socket.id],
        offer: data.offer,
      });
    }
  });

  socket.on('answer', (data) => {
    const toSocketId = getSocketIdByUsername(data.to);
    if (toSocketId) {
      io.to(toSocketId).emit('answer', {
        from: onlineUsers[socket.id],
        answer: data.answer,
      });
    }
  });

  socket.on('ice-candidate', (data) => {
    const toSocketId = getSocketIdByUsername(data.to);
    if (toSocketId) {
      io.to(toSocketId).emit('ice-candidate', {
        from: onlineUsers[socket.id],
        candidate: data.candidate,
      });
    }
  });

  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    console.log('User disconnected:', username);

    delete onlineUsers[socket.id];
    io.emit('users', Object.values(onlineUsers));
  });

  function getSocketIdByUsername(username) {
    return Object.keys(onlineUsers).find(key => onlineUsers[key] === username);
  }
});

server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});
