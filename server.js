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
    position: { x: 0, y: 0 }
  };

  socket.on('disconnect', () => {
    console.log(`${socket.id} USER_DISCONNECTED`);
    users[socket.id] = undefined;
  });

  socket.on('ON_USER_MOVE', (newPosition) => {
    const user = users[socket.id];
    user.position.x = user.position.x + (newPosition.position?.x || 0);
    user.position.y = user.position.y + (newPosition.position?.y || 0);
    io.emit('ON_USERS_UPDATE', JSON.stringify(users));
  });
});

server.listen(3000, () => console.log('listening on *:3000'))