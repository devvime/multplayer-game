const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.use(express.static(__dirname + '/build'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
});

const users = {};

io.on('connection', (socket) => {
  console.log(`${socket.id} USER_CONNECTED`);

  users[socket.id] = { 
    id: socket.id, 
    width: 48,
    height: 48,
    position: { x: 0, y: 0 },
    revert: false,
    anim: 'idle'
  };

  socket.on('disconnect', () => {
    console.log(`${socket.id} USER_DISCONNECTED`);
    users[socket.id] = undefined;
  });

  socket.on('ON_USER_MOVE', (newPosition) => {
    const user = users[socket.id];
    user.position.x = user.position.x + (newPosition.position?.x || 0);
    user.position.y = user.position.y + (newPosition.position?.y || 0);
    user.revert = newPosition.revert
    user.anim = newPosition.anim

    if (user.position.x < -10) user.position.x = -10
    if (user.position.x > 680) user.position.x = 680
    if (user.position.y < 0) user.position.y = 0
    if (user.position.y > 445) user.position.y = 445
    io.emit('ON_USERS_UPDATE', JSON.stringify(users));
  });
});

server.listen(3000, () => console.log('listening on *:3000'))