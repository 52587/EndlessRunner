class Spaceship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = 0.2;
        this.angle = 0;
        // NEW: Load spaceship sprite
        this.image = new Image();
        this.image.src = "assets/Spaceship.png";
    }
    update(deltaTime, keys) {
        if (keys["ArrowLeft"] || keys["a"]) {
            this.angle -= 0.005 * deltaTime;
        }
        if (keys["ArrowRight"] || keys["d"]) {
            this.angle += 0.005 * deltaTime;
        }
        const move = this.speed * deltaTime;
        this.x += Math.cos(this.angle) * move;
        this.y += Math.sin(this.angle) * move;
    }
    render(ctx) {
        ctx.save();
        // Translate to the spaceship's center and rotate
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        // Rotate by current angle plus 90° (Math.PI/2)
        ctx.rotate(this.angle + Math.PI / 2);
        // Draw the spaceship sprite centered around the origin
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
