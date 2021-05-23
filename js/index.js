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
// New Enemy
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

// Random Function
const random = () => {
    return Math.random()
}

// Game Loop
let animateId
const main = () => {
    animateId = window.requestAnimationFrame(main)
    c.clearRect(0,0,canvas.width, canvas.height)
    // Spawn Player
    player.x = window.innerWidth / 2
    player.y = window.innerHeight / 2
    player.draw()

    // Spawn Projectile
    projectTiles.forEach((pTile, pTileIndex) => {
        pTile.update()
        // Remove project tile off screen
        if (
            pTile.x + pTile.radius < 0 ||
            pTile.x - pTile.radius > canvas.width ||
            pTile.y + pTile.radius < 0 ||
            pTile.y - pTile.radius > canvas.height
            ) {
            setTimeout(() => {
                projectTiles.splice(pTileIndex, 1)
            }, 0);
        }
    })

    // Spawn enemy
    enemies.forEach((enemy, enmIndex) => {
        enemy.update()

        // Distance between player and enemy
        const enemyHits = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        // Game Over
        if (enemyHits - enemy.radius - player.radius < 1) {
            window.cancelAnimationFrame(animateId)
        }
        // Touch enemy
        projectTiles.forEach((pTile, pTileIndex) => {
            // Distance between enemy and projecttile
            const projectHit = Math.hypot(pTile.x - enemy.x, pTile.y - enemy.y)

            if (projectHit - enemy.radius - pTile.radius < 1) {
                // Enemy hits
                setTimeout(() => {
                    enemies.splice(enmIndex, 1)
                    projectTiles.splice(pTileIndex, 1)
                }, 0);
            }
        })
    })
}


window.addEventListener('click', (e) => {
    const width = canvas.width / 2
    const height = canvas.height / 2

    // Create angle for projecttile distance
    const angle = Math.atan2(e.clientX - width,e.clientY - height)
    const velocity = {
        x: Math.sin(angle),
        y: Math.cos(angle)
    }
    // New projecttile
    const projectile = new Projectile(c ,width, height, 5, 'red', velocity )
    projectTiles.push(projectile)
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
})

main()
spawnEnemy()