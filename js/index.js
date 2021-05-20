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
        this.x = this.velocity.x
        this.y = this.velocity.y
    }
}
const playerWidth = canvas.width / 2
const playerHeight = canvas.height / 2
const player = new Player(playerWidth, playerHeight, 30, 'red')
player.draw()
function main() {
    window.requestAnimationFrame(main)
}
window.addEventListener('click', (e) => {
    console.log(e.clientX, e.clientY)
    const projectile = new Projectile(e.clientX, e.clientY, 5, 'red', null)
    projectile.draw()
})

main()