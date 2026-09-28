const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Mouse Tracking
const mouse = { x: width / 2, y: height / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// 1. Electric Lightning Bolt Effect
class LightningBolt {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.path = [];
        this.createPath();
    }

    createPath() {
        let curX = this.startX;
        let curY = this.startY;
        this.path.push({ x: curX, y: curY });

        const steps = 12;
        const dx = (this.endX - this.startX) / steps;
        const dy = (this.endY - this.startY) / steps;

        for (let i = 0; i < steps; i++) {
            curX += dx + (Math.random() - 0.5) * 45;
            curY += dy + (Math.random() - 0.5) * 45;
            this.path.push({ x: curX, y: curY });
        }
        this.path.push({ x: this.endX, y: this.endY });
    }

    draw() {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#38bdf8';

        ctx.beginPath();
        for (let i = 0; i < this.path.length; i++) {
            if (i === 0) ctx.moveTo(this.path[i].x, this.path[i].y);
            else ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }
}

// 2. Small Electric Sparks / Glowing Dot Particles (আপনার ইমেজে চিহ্নিত স্পার্ক)
class SparkParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1 + Math.random() * 2.5;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -0.3 - Math.random() * 0.8;
        this.alpha = 0.3 + Math.random() * 0.7;
        this.color = Math.random() > 0.4 ? '#38bdf8' : '#c084fc'; // Cyan & Purple sparks
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.003;

        if (this.alpha <= 0 || this.y < 0) {
            this.reset();
            this.y = height + 10;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 3. Floating Genres (Text) & Gaming Device Icons
const gameGenres = ["FPS", "RPG", "MOBA", "RTS", "OPEN WORLD", "ACTION", "SURVIVAL"];
const deviceIcons = ["\uF11B", "\uF8C7", "\uF26C", "\uF1E6", "\uF013", "\uF005"];

class FloatingElement {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.isText = Math.random() > 0.4;
        this.content = this.isText 
            ? gameGenres[Math.floor(Math.random() * gameGenres.length)]
            : deviceIcons[Math.floor(Math.random() * deviceIcons.length)];
        this.speed = 0.3 + Math.random() * 0.5;
        this.size = this.isText ? (13 + Math.random() * 6) : (18 + Math.random() * 10);
        this.opacity = 0.2 + Math.random() * 0.25;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -50) this.reset();
    }

    draw() {
        ctx.save();
        ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        if (this.isText) {
            ctx.font = `700 ${this.size}px "Inter", sans-serif`;
        } else {
            ctx.font = `900 ${this.size}px "Font Awesome 6 Free"`;
        }
        ctx.fillText(this.content, this.x, this.y);
        ctx.restore();
    }
}

// Arrays Init
const sparkArray = Array.from({ length: 45 }, () => new SparkParticle());
const bgElements = Array.from({ length: 18 }, () => new FloatingElement());

let ballX = width / 2;
let ballY = height / 2;
let activeLightning = null;
let lightningTimer = 0;

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Floating Text & Device Icons
    bgElements.forEach(el => {
        el.update();
        el.draw();
    });

    // Draw Small Electric Sparks
    sparkArray.forEach(spark => {
        spark.update();
        spark.draw();
    });

    // Lightning Bolt Strikes
    lightningTimer++;
    if (lightningTimer % 40 === 0 && Math.random() > 0.3) {
        const sx = Math.random() * width;
        const sy = Math.random() * (height * 0.35);
        const ex = sx + (Math.random() - 0.5) * 300;
        const ey = sy + 150 + Math.random() * 200;
        activeLightning = new LightningBolt(sx, sy, ex, ey);
    }

    if (activeLightning && Math.random() > 0.2) {
        activeLightning.draw();
    }

    // Smooth Mouse Glowing Ball
    ballX += (mouse.x - ballX) * 0.1;
    ballY += (mouse.y - ballY) * 0.1;

    const glowGradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 140);
    glowGradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    glowGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
    glowGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.save();
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    requestAnimationFrame(animate);
}

animate();