import './../public/style.sass'
import sprite from './../public/assets/sprite.png'
import { setEvents, world, player } from './functions'

const socket = io()
const canvas = document.getElementById('canvas')
const states = {
  keys: {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    shift: { pressed: false },
    space: { pressed: false }
  }
}
const config = {
  width: 480,
  height: 240
}

canvas.style.width = config.width
canvas.style.height = config.height

let users = {}
let user = undefined

setEvents(states)

function renderUsers() {
  if (user !== undefined) {
    canvas.innerHTML = world()
    canvas.querySelector('.world').innerHTML += player(users, sprite)
    const background = document.querySelector('.world')

    let backgroundPosition = {
      x: -user.position.x / 2.8,
      y: -user.position.y / 2.2
    }

    if (backgroundPosition.x > 0) backgroundPosition.x = 0
    if (backgroundPosition.x < -436) backgroundPosition.x = -436
    if (backgroundPosition.y > 0) backgroundPosition.y = 0
    if (backgroundPosition.y < -326) backgroundPosition.y = -326

    console.log(user.position.x);

    background.style.transform = `translate(${backgroundPosition.x}px, ${backgroundPosition.y}px)`
  }
}

function move() {
  const data = { id: socket.id, position: { x: 0, y: 0 } }
  let velocity = 2
  if (states.keys.shift.pressed) velocity = 4
  if (states.keys.w.pressed) data.position.y = -velocity
  if (states.keys.s.pressed) data.position.y = velocity
  if (states.keys.a.pressed) data.position.x = -velocity
  if (states.keys.d.pressed) data.position.x = velocity
  socket.emit('ON_USER_MOVE', data)
}

socket.on('connect', () => {
  user = { id: socket.id, position: { x: 0, y: 0 } };
  users[socket.id] = user;
  socket.emit('ON_USER_MOVE', { id: socket.id, position: { x: 0, y: 0 } })
});

socket.on('ON_USERS_UPDATE', (updatedUsers) => {
  users = JSON.parse(updatedUsers)
  user = users[socket.id]
});

function start() {
  window.requestAnimationFrame(start)
  move()
  renderUsers()
}

start()