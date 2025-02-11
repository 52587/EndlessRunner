class DroneUpgrade {
    constructor(spaceship, offsetAngle = 0) {
        this.spaceship = spaceship;
        this.offsetAngle = offsetAngle; // additional angle offset for positioning
        this.size = 30; // drone sprite size
        // NEW: Load drone sprite
        this.image = new Image();
        this.image.src = "assets/drone.png";
        this.updatePosition();
    }
    updatePosition() {
        const centerX = this.spaceship.x + this.spaceship.size / 2;
        const centerY = this.spaceship.y + this.spaceship.size / 2;
        // Place drone at a fixed radius from the spaceship center
        const radius = this.spaceship.size;
        const angle = this.spaceship.angle + this.offsetAngle;
        this.x = centerX + Math.cos(angle) * radius - this.size / 2;
        this.y = centerY + Math.sin(angle) * radius - this.size / 2;
    }
    update(deltaTime) {
        // Increase offsetAngle faster for quicker circling (10x speed increase)
        this.offsetAngle += 0.01 * deltaTime;
        // Update position continuously to follow the spaceship
        this.updatePosition();
    }
    render(ctx) {
        if (this.image.complete && this.image.naturalWidth) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        } else {
            // Fallback: draw a green square if sprite not loaded
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}
window.DroneUpgrade = DroneUpgrade;
