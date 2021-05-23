import Player from './player.js'
import Enemy from './enemy.js'
import Projectile from './projectile.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const playerWidth = canvas.width / 2
const playerHeight = canvas.height / 2

const player = new Player(c, playerWidth, playerHeight, 30, 'blue')

const projectTiles = []

const enemies = []
let enemySpawnSpeed = 2000
const spawnEnemy = () => {
    setInterval(() => {
        const radius = random() * (30 - 5) + 5
        let x
        let y
        if (random() < .5) {
            x = random() < 0.5 ? 0 - radius : canvas.width + radius
            y = random() * canvas.height
        } else {
            x = random() * canvas.width
            y = random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = 'green'
        const angle = Math.atan2(canvas.width / 2 - x ,canvas.height / 2 - y)
        const velocity = {
            x: Math.sin(angle),
            y: Math.cos(angle)
        }
        enemies.push(new Enemy(c, x, y, radius, color, velocity))
    }, enemySpawnSpeed);
}

const random = () => {
    return Math.random()
}
const main = () => {
    window.requestAnimationFrame(main)
    c.clearRect(0,0,canvas.width, canvas.height)
    player.x = window.innerWidth / 2
    player.y = window.innerHeight / 2
    player.draw()
    projectTiles.forEach((pTile) => {
        pTile.update()
    })
    enemies.forEach((enemy) => {
        enemy.update()
    })
}


window.addEventListener('click', (e) => {
    const width = canvas.width / 2
    const height = canvas.height / 2
    const angle = Math.atan2(e.clientX - width,e.clientY - height)
    const velocity = {
        x: Math.sin(angle),
        y: Math.cos(angle)
    }
    const projectile = new Projectile(c ,width, height, 5, 'red', velocity )
    projectTiles.push(projectile)
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
})

main()
spawnEnemy()