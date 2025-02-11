class LoadingScene {
    constructor(game) {
        this.game = game;
        this.loaded = false;
        this.handleClick = this.handleClick.bind(this);
        window.addEventListener("click", this.handleClick);
        // Start preloading resources
        ResourceManager.loadAll()
            .then(res => {
                this.game.resources = res;
                this.loaded = true;
                // Resources loaded; now wait for user click to continue
            })
            .catch(err => console.error("Resource loading failed", err));
        // Lore text for mission
        this.title = "Celestial Odyssey";
        this.loreLines = [
            "In the vast, unyielding expanse of space," ,
            "legends are forged in the heat of endless struggle—but make no mistake:",
            "in this universe, even heroes are disposable.",
            "",
            "The Cosmic Cataclysm",
            "Long ago, the mighty Astral Dominion sought to harness the power of the cosmos,",
            "but their ambition birthed a relentless cosmic storm—a torrent of meteors and astral debris that shattered civilizations and swallowed entire worlds.",
            "In the Dominion's desperate final days, countless ships were launched into the void,",
            "each a sacrificial pawn in a battle against an unstoppable celestial tide.",
            "",
            "Your Role in the Endless Run",
            "You are one such pilot—a lone starfighter hurtling through a maelstrom of destruction aboard a ship cobbled together from the remnants of ancient technology.",
            "Here, your vessel is not a cherished heirloom but a single, expendable tool in a desperate war against chaos.",
            "",
            "The Price of Survival—and Power",
            "Despite being deemed disposable, your journey is far from meaningless. As you dodge the relentless barrage of meteors,",
            "your ship scavenges ancient upgrades and mysterious fragments of lost technology.",
            "Each upgrade is a fleeting spark of hope—a chance to defy the cosmos that sees you as expendable.",
            "",
            "The Ultimate Challenge",
            "Survive against impossible odds, gather relics of a forgotten era, and unlock the hidden power that once fueled the Astral Dominion.",
            "In a universe where every flight might be your last, you are a defiant ember in the cosmic storm.",
            "",
            "Embrace the transient nature of your existence, pilot. Every fall is a prelude to rebirth, and every journey—a testament to survival in a cosmos that cares little for the expendable."
        ];
    }
    handleClick(e) {
        if (this.loaded) {
            window.removeEventListener("click", this.handleClick);
            this.game.changeScene(new MenuScene(this.game));
        }
    }
    update(deltaTime) {
        // Optionally add animations or progress updates here
    }
    render(ctx) {
        const canvas = this.game.canvas;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Render title
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        const titleWidth = ctx.measureText(this.title).width;
        ctx.fillText(this.title, (canvas.width - titleWidth) / 2, 50);
        // Revert change: remove center alignment changes and restore previous spacing
        ctx.textAlign = "start";
        ctx.fillStyle = "lightgray";
        ctx.font = "16px Arial";
        let startY = 90;
        const lineHeight = 22; // revert to previous line spacing
        for (let i = 0; i < this.loreLines.length; i++) {
            const line = this.loreLines[i];
            const lineWidth = ctx.measureText(line).width;
            ctx.fillText(line, (canvas.width - lineWidth) / 2, startY);
            startY += lineHeight;
        }
        if (this.loaded) {
            ctx.fillStyle = "yellow";
            ctx.font = "20px Arial";
            const prompt = "Click anywhere to continue";
            const promptWidth = ctx.measureText(prompt).width;
            ctx.fillText(prompt, (canvas.width - promptWidth) / 2, canvas.height - 40);
        } else {
            ctx.fillStyle = "yellow";
            ctx.font = "18px Arial";
            const loadingText = "Loading Resources...";
            const loadingWidth = ctx.measureText(loadingText).width;
            ctx.fillText(loadingText, (canvas.width - loadingWidth) / 2, canvas.height - 30);
        }
    }
}
window.LoadingScene = LoadingScene;
