class PlayScene {
    constructor(game) {
        this.game = game;
        // NEW: Start BGM when entering PlayScene if not already playing or if previously stopped
        if (this.game.bgm && (!this.game.bgmStarted || this.game.bgm.paused)) {
            this.game.bgm.play().catch(e => console.log("BGM playback failed:", e));
            this.game.bgmStarted = true;
        }
        // Initialize spaceship using the prefab
        this.spaceship = new Spaceship(640, 360);
        // Initialize upgrades system (player starts with no upgrades)
        this.upgrades = new Upgrades();
        this.lives = 3;
        this.timer = 0;
        this.nextUpgradeTime = 10000; // Updated initial upgrade time (comment as desired)
        this.gameOver = false;
        this.keys = {};
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleGameOverClick = this.handleGameOverClick.bind(this);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("click", this.handleGameOverClick);
        // Use meteors instead of obstacles
        this.meteors = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 2000;
        // Use preloaded starfield from game resources
        this.starfield = this.game.resources.starfield;
        // Use pre-cached pattern from resource manager if available
        this.patternCache = this.game.resources.starfieldPattern || null;
        // Initialize background scroll offsets and constant scroll speed
        this.bgOffsetX = 0;
        this.bgOffsetY = 0;
        this.bgScrollSpeedX = 0; // no horizontal constant scroll
        this.bgScrollSpeedY = 0.05; // adjust as needed for vertical scrolling
    }
    handleKeyDown(e) {
        this.keys[e.key] = true;
    }
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    handleGameOverClick(e) {
        if (!this.gameOver) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const canvasWidth = this.game.canvas.width;
        const canvasHeight = this.game.canvas.height;
        const restartButton = { x: canvasWidth / 2 - 150, y: canvasHeight / 2 + 50, width: 120, height: 50 };
        const menuButton = { x: canvasWidth / 2 + 30, y: canvasHeight / 2 + 50, width: 120, height: 50 };
        
        if (x >= restartButton.x && x <= restartButton.x + restartButton.width &&
            y >= restartButton.y && y <= restartButton.y + restartButton.height) {
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            this.game.changeScene(new PlayScene(this.game));
        } else if (x >= menuButton.x && x <= menuButton.x + menuButton.width &&
                   y >= menuButton.y && y <= menuButton.y + menuButton.height) {
            // NEW: Add sound effect for menu button
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            this.game.changeScene(new MenuScene(this.game));
        }
    }
    generateRandomMeteor() {
        // Delegate meteor creation to the prefab
        return Meteor.createRandom(this.game.canvas, this.spaceship, this.timer);
    }
    update(deltaTime) {
        if (this.gameOver) {
            // NEW: Stop bgm on game over and reset flag for restart
            if (!this.game.bgm.paused) {
                this.game.bgm.pause();
                this.game.bgm.currentTime = 0;
                this.game.bgmStarted = false;
            }
            return;
        }
        this.timer += deltaTime;
        if (this.timer >= this.nextUpgradeTime) {
            this.nextUpgradeTime += 20000; // Set time for next upgrade
            this.game.changeScene(new UpgradeMenu(this.game, this));
            return;
        }
        // Update spaceship and background
        this.spaceship.update(deltaTime, this.keys);
        // Clamp spaceship position so it stops at canvas borders
        const canvas = this.game.canvas;
        this.spaceship.x = Math.max(0, Math.min(this.spaceship.x, canvas.width - this.spaceship.size));
        this.spaceship.y = Math.max(0, Math.min(this.spaceship.y, canvas.height - this.spaceship.size));
        this.bgOffsetX += this.bgScrollSpeedX * deltaTime;
        this.bgOffsetY += this.bgScrollSpeedY * deltaTime;
        // Update all active upgrades (Drone and Shield)
        this.upgrades.getActiveUpgrades().forEach(upg => {
            if (upg instanceof DroneUpgrade || upg instanceof ShieldUpgrade) {
                upg.update(deltaTime);
            }
        });
        // Calculate dynamic spawn interval and spawn meteors
        const minInterval = 500; // minimum spawn interval in ms
        const spawnReduction = Math.floor(this.timer / 10000) * 200;
        const effectiveInterval = Math.max(this.obstacleInterval - spawnReduction, minInterval);
        this.obstacleTimer += deltaTime;
        if (this.obstacleTimer >= effectiveInterval) {
            this.meteors.push(this.generateRandomMeteor());
            this.obstacleTimer = 0;
        }
        // Optimize meteor collisions using helper for circle detection
        const shipCenterX = this.spaceship.x + this.spaceship.size / 2;
        const shipCenterY = this.spaceship.y + this.spaceship.size / 2;
        const canvasWidth = this.game.canvas.width;
        const canvasHeight = this.game.canvas.height;
        this.meteors = this.meteors.filter(meteor => {
            meteor.update(deltaTime);
            let blocked = false;
            const meteorCenterX = meteor.x + meteor.size / 2;
            const meteorCenterY = meteor.y + meteor.size / 2;
            // Inline collision check with drone upgrades
            for (let i = 0; i < this.upgrades.activeUpgrades.length; i++) {
                const upg = this.upgrades.activeUpgrades[i];
                if (upg instanceof DroneUpgrade) {
                    const upgCenterX = upg.x + upg.size / 2;
                    const upgCenterY = upg.y + upg.size / 2;
                    const dx = meteorCenterX - upgCenterX;
                    const dy = meteorCenterY - upgCenterY;
                    const sum = (meteor.size / 2) + upg.size;
                    if (dx * dx + dy * dy < sum * sum) {
                        this.upgrades.removeUpgrade(upg);
                        blocked = true;
                        break;
                    }
                }
            }
            // Inline collision check with shield upgrades if not blocked
            if (!blocked) {
                for (let i = 0; i < this.upgrades.activeUpgrades.length; i++) {
                    const upg = this.upgrades.activeUpgrades[i];
                    if (upg instanceof ShieldUpgrade) {
                        const upgCenterX = upg.x + upg.size / 2;
                        const upgCenterY = upg.y + upg.size / 2;
                        const dx = meteorCenterX - upgCenterX;
                        const dy = meteorCenterY - upgCenterY;
                        const sum = (meteor.size / 2) + (upg.size / 2);
                        if (dx * dx + dy * dy < sum * sum) {
                            const shieldSound = this.game.resources.shieldHit;
                            if (shieldSound) {
                                const shieldSoundInstance = shieldSound.cloneNode();
                                shieldSoundInstance.play().catch(e => console.log("Shield hit sound error:", e));
                            }
                            blocked = true;
                            break;
                        }
                    }
                }
            }
            if (blocked) return false;
            // Check simple bounding box collision with spaceship
            const collision = meteor.x < this.spaceship.x + this.spaceship.size &&
                              meteor.x + meteor.size > this.spaceship.x &&
                              meteor.y < this.spaceship.y + this.spaceship.size &&
                              meteor.y + meteor.size > this.spaceship.y;
            if (collision) {
                const hitSound = this.game.resources.hit;
                if (hitSound) {
                    const hitSoundInstance = hitSound.cloneNode();
                    hitSoundInstance.play().catch(e => console.log("Hit sound error:", e));
                }
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                }
            }
            const offScreen = meteor.x + meteor.size < 0 || meteor.x > canvasWidth ||
                              meteor.y + meteor.size < 0 || meteor.y > canvasHeight;
            return !offScreen && !collision;
        });
    }
    render(ctx) {
        const canvas = this.game.canvas;
        ctx.save();
        // Compute effective background offsets using modulo for seamless looping
        const patternWidth = this.starfield.width;
        const patternHeight = this.starfield.height;
        let offsetX = this.bgOffsetX % patternWidth;
        let offsetY = this.bgOffsetY % patternHeight;
        if (offsetX < 0) offsetX += patternWidth;
        if (offsetY < 0) offsetY += patternHeight;
        ctx.translate(-offsetX, -offsetY);
        if (this.starfield.complete && this.patternCache) {
            ctx.fillStyle = this.patternCache;
            ctx.fillRect(0, 0, canvas.width + patternWidth, canvas.height + patternHeight);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
        // Render spaceship via its prefab
        this.spaceship.render(ctx);
        // Render all upgrades including Drone and Shield
        this.upgrades.getActiveUpgrades().forEach(upg => {
            if (upg instanceof DroneUpgrade || upg instanceof ShieldUpgrade) {
                upg.render(ctx);
            }
        });
        // Render meteors via their render method
        this.meteors.forEach(meteor => meteor.render(ctx));
        // Render timer and lives
        ctx.fillStyle = "yellow";
        ctx.font = "20px sans-serif";
        const timeText = "Time: " + Math.floor(this.timer / 1000) + "s";
        const livesText = "Lives: " + this.lives;
        const margin = 10;
        const canvasWidth = canvas.width;
        ctx.fillText(timeText, canvasWidth - ctx.measureText(timeText).width - margin, margin + 20);
        ctx.fillText(livesText, canvasWidth - ctx.measureText(livesText).width - margin, margin + 45);
        if (this.gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "40px sans-serif";
            const msg = "Game Over";
            ctx.fillText(msg, (canvasWidth - ctx.measureText(msg).width) / 2, canvas.height / 2);
            // Draw Restart and Menu buttons
            const restartButton = { x: canvas.width / 2 - 150, y: canvas.height / 2 + 50, width: 120, height: 50 };
            const menuButton = { x: canvas.width / 2 + 30, y: canvas.height / 2 + 50, width: 120, height: 50 };
            ctx.fillStyle = "gray";
            ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
            ctx.fillRect(menuButton.x, menuButton.y, menuButton.width, menuButton.height);
            ctx.fillStyle = "white";
            ctx.font = "20px sans-serif";
            ctx.fillText("Restart", restartButton.x + 10, restartButton.y + 32);
            ctx.fillText("Menu", menuButton.x + 25, menuButton.y + 32);
        }
    }
}
