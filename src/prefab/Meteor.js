class Meteor {
    constructor(x, y, size, vx, vy) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        // NEW: Load meteor sprite
        this.image = new Image();
        this.image.src = "assets/meteor.png";
    }
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
    render(ctx) {
        if (this.image.complete && this.image.naturalWidth) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
    static createRandom(canvas, spaceship) {
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { 
            x = Math.random() * canvas.width; 
            y = 0; 
        } else if (edge === 1) { 
            x = canvas.width; 
            y = Math.random() * canvas.height; 
        } else if (edge === 2) { 
            x = Math.random() * canvas.width; 
            y = canvas.height; 
        } else { 
            x = 0; 
            y = Math.random() * canvas.height; 
        }
        const size = Math.floor(Math.random() * 30) + 20;
        const shipCenterX = spaceship.x + spaceship.size / 2;
        const shipCenterY = spaceship.y + spaceship.size / 2;
        const dx = shipCenterX - x;
        const dy = shipCenterY - y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const baseSpeed = 0.3;
        // Removed timer based speed multiplier; use constant baseSpeed instead.
        return new Meteor(x, y, size, (dx / distance) * baseSpeed, (dy / distance) * baseSpeed);
    }
}
