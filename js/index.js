const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update () {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update () {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
const playerWidth = canvas.width / 2
const playerHeight = canvas.height / 2

const player = new Player(playerWidth, playerHeight, 30, 'blue')

const projectTiles = []

const enemies = []

function spawnEnemy() {
    setInterval(() => {
        const x = random() * canvas.width
        const y = random() * canvas.height
        const radius = 30
        const color = 'green'
        const angle = Math.atan2(canvas.width / 2 - x ,canvas.height / 2 - y)
        const velocity = {
            x: Math.sin(angle),
            y: Math.cos(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000);
}

function random() {
    return Math.random()
}
function main() {
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
    const angle = Math.atan2(e.clientX - canvas.width / 2,e.clientY - canvas.height / 2)
    const velocity = {
        x: Math.sin(angle),
        y: Math.cos(angle)
    }
    const projectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2, 5,
        'red',
        velocity
    )

    projectTiles.push(projectile)
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight  
})

main()
spawnEnemy()