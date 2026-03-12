const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let sparks = [];
let titleSparks = [];
let animationActive = true;
let isRevealed = false;

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

// REVEAL LOGIC
function openInvite() {
    if (isRevealed) return;
    isRevealed = true;

    const cover = document.getElementById('cover');
    const invite = document.getElementById('invite');

    cover.classList.add('hide');
    
    setTimeout(() => {
        invite.classList.add('show');
    }, 400);

    // Fade out intensive sparks to focus on content
    setTimeout(() => {
        animationActive = false;
        // Optionally keep particles but clear sparks
    }, 2000);
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.6 ? '#00E5FF' : '#F4FF81'; 
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle());
    }
}

// CINEMATIC BEAM BETWEEN LOGOS
function drawPowerBeam() {
    if (!animationActive || isRevealed) return;

    const kpil = document.getElementById('logo-kpil');
    const summit = document.getElementById('logo-summit');
    if (!kpil || !summit) return;

    const b1 = kpil.getBoundingClientRect();
    const b2 = summit.getBoundingClientRect();

    const x1 = b1.left + b1.width / 2;
    const y1 = b1.top + b1.height / 2;
    const x2 = b2.left + b2.width / 2;
    const y2 = b2.top + b2.height / 2;

    // Persistent energy pulse
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Random sparks
    if (Math.random() > 0.90) {
        sparks.push({
            timer: 12,
            points: createLightningPoints(x1, y1, x2, y2, 40)
        });
    }

    sparks.forEach((spark, index) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(x2, y2);
        
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00E5FF';
        ctx.globalAlpha = spark.timer / 12;
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        spark.timer--;
        if (spark.timer <= 0) sparks.splice(index, 1);
    });
}

// TITLE LIGHTNING EFFECTS
function drawTitleLightning() {
    if (!animationActive || isRevealed) return;

    const titleContainer = document.querySelector('.title-container');
    if (!titleContainer) return;

    const rect = titleContainer.getBoundingClientRect();
    
    if (Math.random() > 0.96) {
        // Create a spark around the title border
        const side = Math.floor(Math.random() * 4);
        let x1, y1, x2, y2;

        if (side === 0) { // Top
            x1 = rect.left + Math.random() * rect.width;
            y1 = rect.top;
            x2 = x1 + (Math.random() - 0.5) * 50;
            y2 = y1 - 20;
        } else if (side === 1) { // Bottom
            x1 = rect.left + Math.random() * rect.width;
            y1 = rect.bottom;
            x2 = x1 + (Math.random() - 0.5) * 50;
            y2 = y1 + 20;
        } else { // Sides
             x1 = side === 2 ? rect.left : rect.right;
             y1 = rect.top + Math.random() * rect.height;
             x2 = x1 + (side === 2 ? -20 : 20);
             y2 = y1 + (Math.random() - 0.5) * 50;
        }

        titleSparks.push({
            timer: 8,
            points: createLightningPoints(x1, y1, x2, y2, 10)
        });
    }

    titleSparks.forEach((spark, index) => {
        ctx.beginPath();
        ctx.moveTo(spark.points[0].x, spark.points[0].y);
        spark.points.forEach(p => ctx.lineTo(p.x, p.y));
        
        ctx.strokeStyle = '#F4FF81'; // Neon Yellow for title sparks
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#F4FF81';
        ctx.globalAlpha = spark.timer / 8;
        ctx.stroke();

        spark.timer--;
        if (spark.timer <= 0) titleSparks.splice(index, 1);
    });
}

function createLightningPoints(x1, y1, x2, y2, offset) {
    const points = [];
    const segments = 5;
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;

    points.push({x: x1, y: y1});
    for (let i = 1; i < segments; i++) {
        points.push({
            x: x1 + dx * i + (Math.random() - 0.5) * offset,
            y: y1 + dy * i + (Math.random() - 0.5) * offset
        });
    }
    points.push({x: x2, y: y2});
    return points;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (animationActive) {
        drawPowerBeam();
        drawTitleLightning();
    }

    requestAnimationFrame(animate);
}

init();
