class CreditsScene {
    constructor(game) {
        this.game = game;
        // Define Back button dimensions
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
        // Credits screen is static
    }
    render(ctx) {
        const canvas = this.game.canvas;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        const credits = [
            "Credits",
            "--------",
            "Game Design: Sunchi Wang",
            "Programming: Sunchi Wang",
            "Art & Assets: Sunchi Wang",
            "Music: Suno AI",
            "Sound Effects: FreeSound.org",
            "",
            "Thank you for playing!"
        ];
        let startY = 80;
        credits.forEach(line => {
            const textWidth = ctx.measureText(line).width;
            ctx.fillText(line, (canvas.width - textWidth) / 2, startY);
            startY += 35;
        });
        // Draw Back button
        ctx.fillStyle = "gray";
        ctx.fillRect(this.backButton.x, this.backButton.y, this.backButton.width, this.backButton.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        const btnText = "Back";
        const btnTextWidth = ctx.measureText(btnText).width;
        ctx.fillText(btnText, this.backButton.x + (this.backButton.width - btnTextWidth) / 2, this.backButton.y + 32);
    }
}
window.CreditsScene = CreditsScene;
