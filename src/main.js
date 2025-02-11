/*
Title: Celestial Odyssey
Author: Sunchi Wang
Date: 3/19/2024
Approximate hours spent: 40

Core Game Features:
- Space-themed endless runner with upgradeable systems
- Dynamic difficulty scaling through time survival
- Innovative shield and drone defense mechanics
- Physics-based movement and collision systems

Technical Achievements:
1. Advanced Collision System
   - Implemented circle-based collision detection for more accurate hit detection
   - Optimized using squared distances instead of square roots for better performance
   - Separate collision layers for drones and shields with different behaviors

2. Dynamic Sound Management
   - Implemented sound overlap system using Audio.cloneNode()
   - Allows multiple sound effects to play simultaneously
   - Graceful audio error handling with fallbacks

3. Autonomous Menu Spaceship
   - Physics-based movement with velocity vectors
   - Smart border bounce system with directed angles
   - Cooldown system to prevent multiple bounces

Visual Style & Design:
1. Narrative Integration
   - Deep lore presentation in loading screen
   - Cosmic theme with consistent visual elements
   - Story-driven upgrade system

2. Responsive Visual Feedback
   - Shield effects with visual and audio cues
   - Dynamic difficulty scaling with meteor patterns
   - Smooth spaceship rotation physics
*/

class Game {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1280;
        this.canvas.height = 720;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.currentScene = null;
        this.lastTime = performance.now();
        this.gameLoop = this.gameLoop.bind(this);
        // NEW: Create bgm but do not play immediately
        this.bgm = new Audio("assets/bgm.mp3");
        this.bgm.loop = true;
        this.bgm.volume = 0.3; // NEW: Lower bgm volume (30%)
        this.bgmStarted = false;
    }
    start() {
        // Removed scene change here so that the initial LoadingScene is preserved
        // this.changeScene(new MenuScene(this)); // <-- Removed this line
        requestAnimationFrame(this.gameLoop);
    }
    changeScene(scene) {
        this.currentScene = scene;
    }
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
            this.currentScene.render(this.ctx);
        }
        requestAnimationFrame(this.gameLoop);
    }
}
window.onload = function() {
    const game = new Game({
        canvasId: "gameCanvas",
        width: 1280,
        height: 720
    });
    // NEW: Start with LoadingScene to preload resources first
    game.changeScene(new LoadingScene(game));
    game.start();
}
