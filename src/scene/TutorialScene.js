class TutorialScene {
    constructor(game) {
        this.game = game;
        // Define back button dimensions
        this.backButton = { x: (game.canvas.width - 120) / 2, y: game.canvas.height - 100, width: 120, height: 50 };
        this.handleClick = this.handleClick.bind(this);
        window.addEventListener("click", this.handleClick);
    }
    handleClick(e) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Check back button
        if (clickX >= this.backButton.x && clickX <= this.backButton.x + this.backButton.width &&
            clickY >= this.backButton.y && clickY <= this.backButton.y + this.backButton.height) {
            // NEW: Add sound effect for back button
            const selectSound = this.game.resources && this.game.resources.select;
            if (selectSound) {
                const selectSoundInstance = selectSound.cloneNode();
                selectSoundInstance.play().catch(e => console.log("Sound effect error:", e));
            }
            window.removeEventListener("click", this.handleClick);
            this.game.changeScene(new MenuScene(this.game));
        }
    }
    update(deltaTime) {
        // No dynamic updates needed for the tutorial screen
    }
    render(ctx) {
        const canvas = this.game.canvas;
        ctx.fillStyle = "darkslategray";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Render tutorial instructions
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        const message = "Use arrow keys or A/D to rotate.\nDeflect meteors with drones and shield upgrades.";
        const lines = message.split("\n");
        let startY = 100;
        lines.forEach(line => {
            const textWidth = ctx.measureText(line).width;
            ctx.fillText(line, (canvas.width - textWidth) / 2, startY);
            startY += 40;
        });
        // Draw Back button
        ctx.fillStyle = "gray";
        ctx.fillRect(this.backButton.x, this.backButton.y, this.backButton.width, this.backButton.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        const btnText = "Back";
        const textWidth = ctx.measureText(btnText).width;
        ctx.fillText(btnText, this.backButton.x + (this.backButton.width - textWidth) / 2, this.backButton.y + 32);
    }
}
window.TutorialScene = TutorialScene;
