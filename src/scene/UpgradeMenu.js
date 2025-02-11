class UpgradeMenu {
    constructor(game, playScene) {
        this.game = game;
        this.playScene = playScene;
        // Define upgrade options
        this.options = [
            {
                id: "drone",
                name: "Drone Upgrade",
                description: "A drone that deflects meteors.",
                action: (scene) => {
                    const currentDroneCount = scene.upgrades.getActiveUpgrades().filter(u => u instanceof DroneUpgrade).length;
                    const newAngle = (2 * Math.PI * currentDroneCount) / (currentDroneCount + 1);
                    scene.upgrades.addUpgrade(new DroneUpgrade(scene.spaceship, newAngle));
                }
            },
            {
                id: "life",
                name: "Extra Life",
                description: "Gain an extra life.",
                action: (scene) => { scene.lives++; }
            },
            {
                id: "speed",
                name: "Speed Upgrade",
                description: "Increase spaceship speed by 20%.",
                action: (scene) => { scene.spaceship.speed *= 1.2; }
            },
            {
                id: "shield",
                name: "Shield Upgrade",
                description: "Gain a front-facing shield.",
                action: (scene) => {
                    if (!scene.upgrades.getActiveUpgrades().some(u => u instanceof ShieldUpgrade)) {
                        scene.upgrades.addUpgrade(new ShieldUpgrade(scene.spaceship));
                    }
                }
            }
        ];
        // Filter out shield upgrade if already active
        const available = this.options.filter(opt => {
            if (opt.id === "shield") {
                return !playScene.upgrades.getActiveUpgrades().some(u => u instanceof ShieldUpgrade);
            }
            return true;
        });
        // Randomly pick 2 distinct upgrades
        this.randomOptions = [];
        while (available.length && this.randomOptions.length < 2) {
            const idx = Math.floor(Math.random() * available.length);
            this.randomOptions.push(available.splice(idx, 1)[0]);
        }
        // Define option button dimensions
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.margin = 20;
        this.init(); // Bind click events immediately
    }
    update(deltaTime) {
        // Do nothing; game is paused during upgrade selection
    }
    render(ctx) {
        const canvas = this.game.canvas;
        this.playScene.render(ctx);
        // Overlay a semi-transparent layer
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Center the title and buttons
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const title = "Choose an Upgrade";
        const titleWidth = ctx.measureText(title).width;
        ctx.fillText(title, (canvas.width - titleWidth) / 2, 100);
        ctx.font = "20px Arial";
        const totalOptions = this.randomOptions.length;
        const totalHeight = totalOptions * this.buttonHeight + (totalOptions - 1) * this.margin;
        let startY = (canvas.height - totalHeight) / 2;
        this.randomOptions.forEach((option, i) => {
            const btnX = (canvas.width - this.buttonWidth) / 2;
            const btnY = startY + i * (this.buttonHeight + this.margin);
            // Draw button background
            ctx.fillStyle = "gray";
            ctx.fillRect(btnX, btnY, this.buttonWidth, this.buttonHeight);
            // Draw option text
            ctx.fillStyle = "white";
            ctx.fillText(option.name, btnX + 10, btnY + 30);
        });
    }
    handleClick(e) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const totalOptions = this.randomOptions.length;
        const totalHeight = totalOptions * this.buttonHeight + (totalOptions - 1) * this.margin;
        const startY = (canvas.height - totalHeight) / 2;
        const btnX = (canvas.width - this.buttonWidth) / 2;
        this.randomOptions.forEach((option, i) => {
            const btnY = startY + i * (this.buttonHeight + this.margin);
            if (clickX >= btnX && clickX <= btnX + this.buttonWidth &&
                clickY >= btnY && clickY <= btnY + this.buttonHeight) {
                // Use preloaded select sound instead of new Audio instance
                const selectSound = this.game.resources.select;
                if (selectSound) {
                    selectSound.play().catch(e => console.log("Sound effect error:", e));
                }
                option.action(this.playScene);
                window.removeEventListener("click", this.boundClick);
                this.game.changeScene(this.playScene);
            }
        });
    }
    init() {
        // Bind click for upgrade selection
        this.boundClick = this.handleClick.bind(this);
        window.addEventListener("click", this.boundClick);
    }
}
window.UpgradeMenu = UpgradeMenu;
