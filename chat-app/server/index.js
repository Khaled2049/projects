const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const router = require('./router');

const app = express();
app.use(router);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on('connection', (socket) => {
  console.log('New connection!');

  socket.on('disconnect', () => {
    console.log('User has left!');
  });
});

httpServer.listen(3000, () => {
  console.log('Server running');
});
