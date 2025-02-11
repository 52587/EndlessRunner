class ResourceManager {
    static loadAll() {
        return new Promise((resolve, reject) => {
            const resources = {};
            const promises = [];
            // Load starfield image and create pattern
            promises.push(new Promise((resolveImg, rejectImg) => {
                const img = new Image();
                img.onload = () => {
                    img.decode()
                    .then(() => {
                        resources.starfield = img;
                        const offscreen = document.createElement("canvas");
                        offscreen.width = img.width;
                        offscreen.height = img.height;
                        const ctx = offscreen.getContext("2d");
                        resources.starfieldPattern = ctx.createPattern(img, "repeat");
                        resolveImg();
                    })
                    .catch(rejectImg);
                };
                img.onerror = rejectImg;
                img.src = "assets/starfield.png";
            }));
            // Load spaceship image
            promises.push(new Promise((resolveImg, rejectImg) => {
                const img = new Image();
                img.onload = () => { resources.spaceship = img; resolveImg(); };
                img.onerror = rejectImg;
                img.src = "assets/Spaceship.png";
            }));
            // Load bgm audio
            promises.push(new Promise((resolveAudio, rejectAudio) => {
                const audio = new Audio("assets/bgm.mp3");
                audio.oncanplaythrough = () => { resources.bgm = audio; resolveAudio(); };
                audio.onerror = rejectAudio;
            }));
            // Load select sound audio
            promises.push(new Promise((resolveAudio, rejectAudio) => {
                const audio = new Audio("assets/select.mp3");
                audio.oncanplaythrough = () => { resources.select = audio; resolveAudio(); };
                audio.onerror = rejectAudio;
            }));
            // Load shield image
            promises.push(new Promise((resolveImg, rejectImg) => {
                const img = new Image();
                img.onload = () => { resources.shield = img; resolveImg(); };
                img.onerror = rejectImg;
                img.src = "assets/shield.png";
            }));
            // Load hit sound audio
            promises.push(new Promise((resolveAudio, rejectAudio) => {
                const audio = new Audio("assets/hit.wav");
                audio.oncanplaythrough = () => { resources.hit = audio; resolveAudio(); };
                audio.onerror = rejectAudio;
            }));
            // NEW: Load shield hit sound audio
            promises.push(new Promise((resolveAudio, rejectAudio) => {
                const audio = new Audio("assets/shield.mp3");
                audio.oncanplaythrough = () => { resources.shieldHit = audio; resolveAudio(); };
                audio.onerror = rejectAudio;
            }));
            Promise.all(promises)
                .then(() => resolve(resources))
                .catch(reject);
        });
    }
}
window.ResourceManager = ResourceManager;
