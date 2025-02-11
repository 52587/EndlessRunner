class Upgrades {
    constructor() {
        // Array for player's active upgrades (empty for now)
        this.activeUpgrades = [];
    }
    addUpgrade(upgrade) {
        // Placeholder to add an upgrade
        this.activeUpgrades.push(upgrade);
    }
    removeUpgrade(upgrade) {
        // Placeholder to remove an upgrade
        this.activeUpgrades = this.activeUpgrades.filter(u => u !== upgrade);
    }
    getActiveUpgrades() {
        return this.activeUpgrades;
    }
}
window.Upgrades = Upgrades;
