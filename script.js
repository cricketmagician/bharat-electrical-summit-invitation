const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let sparks = [];
let animationActive = true;

function init() {
    resize();
    createParticles();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

// REVEAL ANIMATION LOGIC
function openInvite() {
    const cover = document.getElementById('cover');
    const invite = document.getElementById('invite');

    cover.classList.add('hide');
    
    setTimeout(() => {
        invite.classList.add('show');
        // Optionally slow down particles or change mood after reveal
    }, 400);

    // Stop sparks after reveal to focus on details
    setTimeout(() => {
        animationActive = false;
        ctx.clearRect(0, 0, width, height);
    }, 1500);
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.3;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#F4FF81'; 
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
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
    if (!animationActive) return;

    const kpil = document.getElementById('logo-kpil');
    const summit = document.getElementById('logo-summit');
    if (!kpil || !summit) return;

    const b1 = kpil.getBoundingClientRect();
    const b2 = summit.getBoundingClientRect();

    const x1 = b1.left + b1.width / 2;
    const y1 = b1.top + b1.height / 2;
    const x2 = b2.left + b2.width / 2;
    const y2 = b2.top + b2.height / 2;

    if (Math.random() > 0.94) {
        sparks.push({
            timer: 8,
            points: createLightningPoints(x1, y1, x2, y2)
        });
    }

    sparks.forEach((spark, index) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(x2, y2);
        
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00E5FF';
        ctx.globalAlpha = spark.timer / 8;
        ctx.stroke();

        spark.timer--;
        if (spark.timer <= 0) sparks.splice(index, 1);
    });
}

function createLightningPoints(x1, y1, x2, y2) {
    const points = [];
    const segments = 5;
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
    if (!animationActive && sparks.length === 0) {
        // Just draw particles for atmosphere
         ctx.clearRect(0, 0, width, height);
         particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawSpark();
    requestAnimationFrame(animate);
}

init();
