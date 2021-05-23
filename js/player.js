export default class Player {
    constructor(canvas, x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.canvas = canvas
    }

    draw () {
        this.canvas.beginPath()
        this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.canvas.fillStyle = this.color
        this.canvas.fill()
    }
}