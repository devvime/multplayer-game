export const setKeys = (key, value, states) => {
  switch (key) {
    case 'w':
    case 'W':
    case 'ArrowUp':
      states.keys.w.pressed = value;
    break
    case 'a':
    case 'A':
    case 'ArrowLeft':
      states.keys.a.pressed = value;
    break
    case 's':
    case 'S':
    case 'ArrowDown':
      states.keys.s.pressed = value;
    break
    case 'd':
    case 'D':
    case 'ArrowRight':
      states.keys.d.pressed = value;
    break
    case 'Shift':
      states.keys.shift.pressed = value;
    break
  }
}

export const setEvents = (states) => {
  document.addEventListener('keydown', e => {
    setKeys(e.key, true, states)
  })  
  document.addEventListener('keyup', e => {
    setKeys(e.key, false, states)
  })
}

export const player = (users, sprites) => {
  return (`
    ${Object.keys(users).map((userId) => {
      const user = users[userId]   
      let anim
      switch (user.anim) {
        case 'idle':
          anim = sprites.idle
        break
        case 'run':
          anim = sprites.run
        break
      }

      const revert = user.revert ? 'transform: scaleX(-1);' : ''
      return (`
            <div 
              class="player animIdle" 
              style="top: ${user.position.y || 0}px;
                     left: ${user.position.x || 0}px;
                     background-image: url(${anim});
                     ${revert}"
              id="${user.id}"></div>
      `);
    }).join('')}
  `)
}

export const world = () => {
  return (`
    <div class="world">
      <img src="https://i.pinimg.com/736x/37/d8/76/37d876aa3aed1f1b781ab1d408350d7f.jpg">
    </div>
  `)
}