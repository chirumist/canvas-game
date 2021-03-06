import Player from './player.js'
import Enemy from './enemy.js'
import Projectile from './projectile.js'
import Partical from './partical.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scores = document.querySelectorAll('.score')
const modal = document.querySelector('.modal')
const startButton = document.querySelector('#restart-game')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let currentScore = 0

let enemyHelth = 10
let projectTileSpeed = 5

const playerWidth = canvas.width / 2
const playerHeight = canvas.height / 2

const player = new Player(c, playerWidth, playerHeight, 10, 'white')
const particals = []
const projectTiles = []
const enemies = []

let isMultipleProjectile = true
let isMultipleProjectileOnMove = false

function resetGame () {
    particals.length = 0
    enemies.length = 0
    projectTiles.length = 0
    currentScore = 0
}
// New Enemy
let enemyIntervel
let enemySpawnSpeed = 2000
const spawnEnemy = () => {
    enemyIntervel = setInterval(() => {
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
        const color = `hsl(${Math.floor(Math.random() * 360)},50%, 50%)`
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
    Array.from(scores, (elem) => {
        elem.innerText = currentScore
    })
    c.fillStyle = 'rgba(0,0,0, .1)'
    c.fillRect(0,0,canvas.width, canvas.height)
    // Spawn Player
    player.x = window.innerWidth / 2
    player.y = window.innerHeight / 2
    player.draw()

    // Create particals
    particals.forEach((partical, particalIndex) => {
        if (partical.alpha <= 0) {
            setTimeout(() => {
                particals.splice(particalIndex, 1)
            }, 0);
        } else {
            partical.update()
        }
    })

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
            window.clearInterval(enemyIntervel)
            modal.style.display = 'block'
        }
        // Touch enemy
        projectTiles.forEach((pTile, pTileIndex) => {
            // Distance between enemy and projecttile
            const projectHit = Math.hypot(pTile.x - enemy.x, pTile.y - enemy.y)

            // When projecttile touch enemy
            if (projectHit - enemy.radius - pTile.radius < 1) {
                // if(currentScore % 10) {
                //     isMultipleProjectileOnMove = true
                //     setTimeout(() => {
                //         isMultipleProjectileOnMove = false
                //     }, 1000);
                // }
                // create exploions effect
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particals.push(
                        new Partical( c, 
                            pTile.x, pTile.y, 
                            random() * 2, 
                            enemy.color, 
                            {
                                x: (random() - .5) * (random() * 6),
                                y: (random() - .5) * (random() * 6)
                            }
                        )
                    )
                }
                if (enemy.radius - enemyHelth > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - enemyHelth
                    })
                    setTimeout(() => {
                        projectTiles.splice(pTileIndex, 1)
                        // Increase current score
                        currentScore += 1
                    }, 0);
                } else {
                    setTimeout(() => {
                        enemies.splice(enmIndex, 1)
                        projectTiles.splice(pTileIndex, 1)

                        // Increase current score
                        currentScore += 2
                    }, 0);
                }
            }
        })
    })
}

let machineGun

function shootProjectile(e) {
    const width = canvas.width / 2
    const height = canvas.height / 2

    // Create angle for projecttile distance
    const angle = Math.atan2(e.clientX - width,e.clientY - height)
    const velocity = {
        x: Math.sin(angle) * projectTileSpeed,
        y: Math.cos(angle) * projectTileSpeed
    }
    // New projecttile
    if (modal.style.display === 'none') {
        if(!isMultipleProjectileOnMove) {
            const projectile = new Projectile(c ,width, height, 5, 'white', velocity )
            projectTiles.push(projectile)
            if(isMultipleProjectile) {
                machineGun = setInterval(() => {
                    const projectile = new Projectile(c ,width, height, 5, 'white', velocity )
                    projectTiles.push(projectile)
                }, 300);
            }
        } else {
            const projectile = new Projectile(c ,width, height, 5, 'white', velocity )
            projectTiles.push(projectile)
        }
    }
}
function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
  }
window.addEventListener("mousedown", function(e){
    if (e.button == 0) {
        shootProjectile(e)
    }
})

window.addEventListener("mousemove", function(e){
    if(isMultipleProjectileOnMove) {
        shootProjectile(e)
    }
})

window.addEventListener("mouseup", function(e){
    clearInterval(machineGun)
})

window.addEventListener("touchmove", function(e) {
    if(isMultipleProjectileOnMove) {
        shootProjectile(e)
    }
})

window.addEventListener('touchstart',(e) => {
    shootProjectile(e)
});

window.addEventListener('touchend',(e) => {
    clearInterval(machineGun)
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
})

startButton.addEventListener('click', (e) => {
    modal.style.display = 'none'
    resetGame()
    main()
    spawnEnemy()
 })