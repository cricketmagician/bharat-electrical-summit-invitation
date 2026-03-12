const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let sparks = [];

function init() {
    resize();
    createParticles();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#F4FF81'; 
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function drawSpark() {
    const kpil = document.getElementById('kpil-container');
    const summit = document.getElementById('summit-container');
    if (!kpil || !summit) return;

    const kBox = kpil.getBoundingClientRect();
    const sBox = summit.getBoundingClientRect();

    const startX = kBox.left + kBox.width / 2;
    const startY = kBox.top + kBox.height / 2;
    const endX = sBox.left + sBox.width / 2;
    const endY = sBox.top + sBox.height / 2;

    if (Math.random() > 0.92) {
        sparks.push({
            timer: 10,
            points: createLightningPoints(startX, startY, endX, endY)
        });
    }

    sparks.forEach((spark, index) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(endX, endY);
        
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00E5FF';
        ctx.globalAlpha = spark.timer / 10;
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        spark.timer--;
        if (spark.timer <= 0) sparks.splice(index, 1);
    });
}

function createLightningPoints(x1, y1, x2, y2) {
    const points = [];
    const segments = 6;
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;

    for (let i = 1; i < segments; i++) {
        points.push({
            x: x1 + dx * i + (Math.random() - 0.5) * 30,
            y: y1 + dy * i + (Math.random() - 0.5) * 30
        });
    }
    return points;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawSpark();
    requestAnimationFrame(animate);
}

init();
