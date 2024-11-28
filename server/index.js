const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ACTIONS = require('../src/Actions');
const io = new Server(server);

const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

require('./config.js/db'); // Adjust path accordingly


app.get('/', (req, res) => {
  res.send("webSocket is running fine");
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      userName: userSocketMap[socketId] || 'Anonymous',
    })
  );
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    console.log(`${userName} joined the room: ${roomId}`);
    userSocketMap[socket.id] = userName; 
    socket.join(roomId);
    console.log("userSocketMap on join", userSocketMap); 

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName, 
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // User leaving a specific room
  socket.on(ACTIONS.LEAVE, ({ roomId }) => {
    console.log("userSocketMap on LEAVE", userSocketMap); // Log the map to see if username exists
    const username = userSocketMap[socket.id]; // Should retrieve the correct username
    console.log(`User leaving: ${username}`);

    // Notify other users in the room about the user leaving
    socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
      socketId: socket.id,
      userName: userSocketMap[socket.id], // Send username before deleting it
    });

    delete userSocketMap[socket.id];
    socket.leave(roomId);
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms]; // Get all rooms the socket was part of
    console.log("userSocketMap on disconnecting", userSocketMap);
  
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id], // Send username before deleting it
      });
    });
  
    // Clean up the user from the rooms map and socket map
    delete userSocketMap[socket.id];
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
