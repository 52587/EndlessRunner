class MenuScene {
    constructor(game) {
        this.game = game;
        // Define three buttons: Start, Tutorial, and Credits
        this.startButton = { x: (game.canvas.width - 120) / 2, y: 300, width: 120, height: 50 };
        this.tutorialButton = { x: (game.canvas.width - 120) / 2, y: 380, width: 120, height: 50 };
        this.creditsButton = { x: (game.canvas.width - 120) / 2, y: 460, width: 120, height: 50 };
        this.handleClick = this.handleClick.bind(this);
        window.addEventListener("click", this.handleClick);
        // Create autonomous menu spaceship
        this.menuSpaceship = new Spaceship(game.canvas.width / 2, game.canvas.height / 2);
        // Set random initial velocity in pixels per second
        this.menuSpaceship.vx = Math.random() * 200 - 100;
        this.menuSpaceship.vy = Math.random() * 200 - 100;
        // Initialize bounce limiter
        this.bounceTimer = 0;
        this.bounceCooldown = 500; // in milliseconds
    }
    handleClick(e) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        // Check Start button
        if (
            clickX >= this.startButton.x && clickX <= this.startButton.x + this.startButton.width &&
            clickY >= this.startButton.y && clickY <= this.startButton.y + this.startButton.height
        ) {
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            window.removeEventListener("click", this.handleClick);
            this.game.changeScene(new PlayScene(this.game));
        }
        // Check Tutorial button
        else if (
            clickX >= this.tutorialButton.x && clickX <= this.tutorialButton.x + this.tutorialButton.width &&
            clickY >= this.tutorialButton.y && clickY <= this.tutorialButton.y + this.tutorialButton.height
        ) {
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            window.removeEventListener("click", this.handleClick);
            this.game.changeScene(new TutorialScene(this.game));
        }
        // Check Credits button
        else if (
            clickX >= this.creditsButton.x && clickX <= this.creditsButton.x + this.creditsButton.width &&
            clickY >= this.creditsButton.y && clickY <= this.creditsButton.y + this.creditsButton.height
        ) {
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            window.removeEventListener("click", this.handleClick);
            this.game.changeScene(new CreditsScene(this.game));
        }
    }
    update(deltaTime) {
        if (this.menuSpaceship) {
            this.menuSpaceship.x += this.menuSpaceship.vx * (deltaTime / 1000 * 3);
            this.menuSpaceship.y += this.menuSpaceship.vy * (deltaTime / 1000 * 3);
            this.menuSpaceship.angle = Math.atan2(this.menuSpaceship.vy, this.menuSpaceship.vx);
            const canvas = this.game.canvas;
            this.bounceTimer += deltaTime;

            // NEW: Determine which border was hit and bounce accordingly
            if (this.bounceTimer >= this.bounceCooldown) {
                let hitBorder = false;
                let baseAngle = 0;

                // Left border
                if (this.menuSpaceship.x < 0) {
                    hitBorder = true;
                    baseAngle = 0; // Bounce rightward
                    this.menuSpaceship.x = 0;
                }
                // Right border
                else if (this.menuSpaceship.x + this.menuSpaceship.size > canvas.width) {
                    hitBorder = true;
                    baseAngle = Math.PI; // Bounce leftward
                    this.menuSpaceship.x = canvas.width - this.menuSpaceship.size;
                }
                // Top border
                else if (this.menuSpaceship.y < 0) {
                    hitBorder = true;
                    baseAngle = Math.PI / 2; // Bounce downward
                    this.menuSpaceship.y = 0;
                }
                // Bottom border
                else if (this.menuSpaceship.y + this.menuSpaceship.size > canvas.height) {
                    hitBorder = true;
                    baseAngle = -Math.PI / 2; // Bounce upward
                    this.menuSpaceship.y = canvas.height - this.menuSpaceship.size;
                }

                if (hitBorder) {
                    const speed = Math.hypot(this.menuSpaceship.vx, this.menuSpaceship.vy);
                    // Random angle within 180 degrees (PI radians) centered on the base angle
                    const randomOffset = (Math.random() - 0.5) * Math.PI;
                    const bounceAngle = baseAngle + randomOffset;
                    this.menuSpaceship.vx = speed * Math.cos(bounceAngle);
                    this.menuSpaceship.vy = speed * Math.sin(bounceAngle);
                    this.bounceTimer = 0;
                }
            }
        }
    }
    render(ctx) {
        const canvas = this.game.canvas;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Render autonomous menu spaceship
        if (this.menuSpaceship) {
            this.menuSpaceship.render(ctx);
        }
        // Render title
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const title = "Celestial Odyssey";
        const titleWidth = ctx.measureText(title).width;
        ctx.fillText(title, (canvas.width - titleWidth) / 2, 100);
        // Draw Start button
        ctx.fillStyle = "gray";
        ctx.fillRect(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Start", this.startButton.x + 20, this.startButton.y + 33);
        // Draw Tutorial button
        ctx.fillStyle = "gray";
        ctx.fillRect(this.tutorialButton.x, this.tutorialButton.y, this.tutorialButton.width, this.tutorialButton.height);
        ctx.fillStyle = "white";
        ctx.fillText("Tutorial", this.tutorialButton.x + 10, this.tutorialButton.y + 33);
        // Draw Credits button
        ctx.fillStyle = "gray";
        ctx.fillRect(this.creditsButton.x, this.creditsButton.y, this.creditsButton.width, this.creditsButton.height);
        ctx.fillStyle = "white";
        ctx.fillText("Credits", this.creditsButton.x + 10, this.creditsButton.y + 33);
    }
}
window.MenuScene = MenuScene;
