class ShieldUpgrade {
    constructor(spaceship) {
        this.spaceship = spaceship;
        this.offset = 40; // distance in front of the spaceship
        this.size = 40;   // shield diameter
        this.x = spaceship.x;
        this.y = spaceship.y;
        // NEW: Use preloaded shield sprite if available; fall back to direct load
        this.sprite = window.game?.resources?.shield || new Image();
        if (!this.sprite.src) {
            this.sprite.src = "assets/shield.png";
        }
    }
    update(deltaTime) {
        const centerX = this.spaceship.x + this.spaceship.size / 2;
        const centerY = this.spaceship.y + this.spaceship.size / 2;
        // Position shield in front based on spaceship's angle
        const shieldCenterX = centerX + Math.cos(this.spaceship.angle) * this.offset;
        const shieldCenterY = centerY + Math.sin(this.spaceship.angle) * this.offset;
        this.x = shieldCenterX - this.size / 2;
        this.y = shieldCenterY - this.size / 2;
    }
    render(ctx) {
        ctx.save();
        // Translate to spaceship's center
        const centerX = this.spaceship.x + this.spaceship.size / 2;
        const centerY = this.spaceship.y + this.spaceship.size / 2;
        ctx.translate(centerX, centerY);
        // Use spaceship's angle without additional rotation
        ctx.rotate(this.spaceship.angle);
        // Shield positioned offset to the right (in spaceship's local coordinates)
        const shieldX = this.offset - this.size / 2;
        const shieldY = -this.size / 2;
        if (this.sprite.complete && this.sprite.naturalWidth) {
            ctx.drawImage(this.sprite, shieldX, shieldY, this.size, this.size);
        } else {
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(shieldX + this.size / 2, shieldY + this.size / 2, this.size / 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}
window.ShieldUpgrade = ShieldUpgrade;
