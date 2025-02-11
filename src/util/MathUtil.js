// Returns true if two circles (with centers and radii) are colliding
function areCirclesColliding(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const sum = r1 + r2;
    return (dx * dx + dy * dy) < (sum * sum);
}

// Randomizes velocity keeping the same speed
function randomizeVelocity(vx, vy) {
    const speed = Math.hypot(vx, vy);
    const angle = Math.random() * Math.PI * 2;
    return {
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle)
    };
}

window.areCirclesColliding = areCirclesColliding;
window.randomizeVelocity = randomizeVelocity;
