const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let sparks = [];

function init() {
    resize();
    createParticles();
    initScrollReveal();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
// Handle dynamic scroll height changes
window.addEventListener('scroll', () => {
    if (canvas.height < document.documentElement.scrollHeight) {
        resize();
    }
});

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#F4FF81'; // Electric blue or neon yellow
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) { // Increased particle count for scroll depth
        particles.push(new Particle());
    }
}

// Electric Spark logic between logos
function drawSpark() {
    const kpil = document.getElementById('kpil-container').getBoundingClientRect();
    const summit = document.getElementById('summit-container').getBoundingClientRect();

    // Calculate position relative to fixed container or scroll if needed
    // Using viewport-relative coordinates from getBoundingClientRect
    const startX = kpil.left + kpil.width / 2;
    const startY = kpil.top + kpil.height / 2 + window.scrollY;
    const endX = summit.left + summit.width / 2;
    const endY = summit.top + summit.height / 2 + window.scrollY;

    if (Math.random() > 0.9) {
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
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00E5FF';
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        spark.timer--;
        if (spark.timer <= 0) sparks.splice(index, 1);
    });
}

function createLightningPoints(x1, y1, x2, y2) {
    const points = [];
    const segments = 10;
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;

    for (let i = 1; i < segments; i++) {
        points.push({
            x: x1 + dx * i + (Math.random() - 0.5) * 40,
            y: y1 + dy * i + (Math.random() - 0.5) * 40
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
