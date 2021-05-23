export default class Enemy {
    constructor(canvas, x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.canvas = canvas
    }

    draw () {
        this.canvas.beginPath()
        this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.canvas.fillStyle = this.color
        this.canvas.fill()
    }

    update () {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}