const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('main-slider');

let width, height;
let particles = [];
let sparks = [];
let currentSlide = 0;

// Swipe Support Variables
let touchStartX = 0;
let touchEndX = 0;

function init() {
    resize();
    createParticles();
    initTouchEvents();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

// Slide Navigation
function nextSlide() {
    currentSlide = 1;
    slider.style.transform = `translateX(-100vw)`;
}

function prevSlide() {
    currentSlide = 0;
    slider.style.transform = `translateX(0vw)`;
}

// Touch/Swipe Gestures
function initTouchEvents() {
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
}

function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
        nextSlide(); // Swipe left
    } else if (touchEndX - touchStartX > threshold) {
        prevSlide(); // Swipe right
    }
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
        this.opacity = Math.random() * 0.3 + 0.1;
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
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
}

// Electric Spark
function drawSpark() {
    // Only logic for Slide 1 (Cover) where logos are
    if (currentSlide !== 0) return;

    // Relative to viewport is fine here since it's full screen slide
    const logos = document.querySelectorAll('.logo-box');
    if (logos.length < 2) return;

    const b1 = logos[0].getBoundingClientRect();
    const b2 = logos[1].getBoundingClientRect();

    const x1 = b1.left + b1.width / 2;
    const y1 = b1.top + b1.height / 2;
    const x2 = b2.left + b2.width / 2;
    const y2 = b2.top + b2.height / 2;

    if (Math.random() > 0.94) {
        sparks.push({
            timer: 10,
            points: createLightningPoints(x1, y1, x2, y2)
        });
    }

    sparks.forEach((spark, index) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(x2, y2);
        
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
