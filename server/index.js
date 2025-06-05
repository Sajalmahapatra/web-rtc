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
const usernameToSocketId = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', (username) => {
    // onlineUsers[socket.id] = username;

    // // Send full updated user list to everyone
    // io.emit('users', Object.values(onlineUsers));
    // console.log('User logged in:', username);


    usernameToSocketId[username] = socket.id;
    socket.username = username;

    // Emit user list to everyone except this user
    const users = Object.keys(usernameToSocketId);
    io.emit("users", users);

    console.log('User logged in:', users);
  });
  socket.on("private_message", ({ to, message }) => {
    const targetSocketId = usernameToSocketId[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", {
        from: socket.username,
        message,
      });
    }
  });

  // socket.on('offer', (data) => {
  //   const toSocketId = getSocketIdByUsername(data.to);
  //   if (toSocketId) {
  //     io.to(toSocketId).emit('offer', {
  //       from: onlineUsers[socket.id],
  //       offer: data.offer,
  //     });
  //   }
  // });

  socket.on('offer', (data) => {
    const toSocketId = usernameToSocketId[data.to];
    if (toSocketId) {
      io.to(toSocketId).emit('offer', {
        from: socket.username,
        offer: data.offer,
      });
    }
  });

  // socket.on('answer', (data) => {
  //   const toSocketId = getSocketIdByUsername(data.to);
  //   if (toSocketId) {
  //     io.to(toSocketId).emit('answer', {
  //       from: onlineUsers[socket.id],
  //       answer: data.answer,
  //     });
  //   }
  // });

  // socket.on('ice-candidate', (data) => {
  //   const toSocketId = getSocketIdByUsername(data.to);
  //   if (toSocketId) {
  //     io.to(toSocketId).emit('ice-candidate', {
  //       from: onlineUsers[socket.id],
  //       candidate: data.candidate,
  //     });
  //   }
  // });

  socket.on('ice-candidate', (data) => {
    const toSocketId = usernameToSocketId[data.to];
    if (toSocketId) {
      io.to(toSocketId).emit('ice-candidate', {
        from: socket.username,
        candidate: data.candidate,
      });
    }
  });

  // socket.on('disconnect', () => {
  //   const username = onlineUsers[socket.id];
  //   console.log('User disconnected:', username);

  //   delete onlineUsers[socket.id];
  //   io.emit('users', Object.values(onlineUsers));
  // });
  socket.on('disconnect', () => {
    if (socket.username) {
      delete usernameToSocketId[socket.username];
      io.emit("users", Object.keys(usernameToSocketId));
    }
  });

  

  // function getSocketIdByUsername(username) {
  //   return Object.keys(onlineUsers).find(key => onlineUsers[key] === username);
  // }
});

server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});
