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
    height = canvas.height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // Keep canvas fixed for global particles
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
}

window.addEventListener('resize', resize);

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // To make it look like a "story", we can hide them when scrolled back up
                // but usually Apple style keeps them once revealed unless specifically doing parallax
                // entry.target.classList.remove('active'); 
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
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#F4FF81'; 
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.restore();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
}

// Electric Spark logic: Only between logos when they are in view
function drawSpark() {
    const connectionSection = document.querySelector('.connection-section');
    if (!connectionSection) return;
    
    const rect = connectionSection.getBoundingClientRect();
    // Only draw if the section is mostly in viewport
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const kpil = document.getElementById('kpil-container');
    const summit = document.getElementById('summit-container');
    if (!kpil || !summit) return;

    const kBox = kpil.getBoundingClientRect();
    const sBox = summit.getBoundingClientRect();

    const startX = kBox.left + kBox.width / 2;
    const startY = kBox.top + kBox.height / 2;
    const endX = sBox.left + sBox.width / 2;
    const endY = sBox.top + sBox.height / 2;

    if (Math.random() > 0.88) {
        sparks.push({
            timer: 15,
            points: createLightningPoints(startX, startY, endX, endY)
        });
    }

    sparks.forEach((spark, index) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(endX, endY);
        
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00E5FF';
        ctx.globalAlpha = (spark.timer / 15) * 0.8;
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

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
            x: x1 + dx * i + (Math.random() - 0.5) * 50,
            y: y1 + dy * i + (Math.random() - 0.5) * 50
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
