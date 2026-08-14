AOS.init({ once: true, offset: 100, duration: 800, easing: 'ease-out-cubic' });

// Navbar Blur Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('bg-[#030712]/80', 'backdrop-blur-md', 'border-b', 'border-slate-800', 'shadow-xl');
    } else {
        nav.classList.remove('bg-[#030712]/80', 'backdrop-blur-md', 'border-b', 'border-slate-800', 'shadow-xl');
    }
});

// ============================================================
// MESIN FISIKA EFEK KARET MELAR (ID CARD)
// ============================================================
const lanyard = document.getElementById('interactive-card');
const strap = document.getElementById('lanyard-strap');
const joint = document.getElementById('card-joint');

let isDragging = false;
let originX = 0, originY = 0;
let grabDistance = 0; 
let strapHeight = 112; 

let tAngle = 0, tJointAngle = 0, tTiltX = 0, tTiltY = 0, tStretch = 0;
let cAngle = 0, cJointAngle = 0, cTiltX = 0, cTiltY = 0, cStretch = 0;
let vAngle = 0, vJointAngle = 0, vTiltX = 0, vTiltY = 0, vStretch = 0;

const tension = 0.12;  
const friction = 0.78; 

if (lanyard && joint && strap) {
    lanyard.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.cursor = 'grabbing';
        lanyard.classList.replace('cursor-grab', 'cursor-grabbing');
        
        const rect = lanyard.getBoundingClientRect();
        originX = rect.left + (rect.width / 2);
        originY = rect.top; 
        
        strapHeight = strap.offsetHeight || 112; 
        
        const deltaX = e.clientX - originX;
        const deltaY = e.clientY - originY;
        grabDistance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - originX;
        const deltaY = e.clientY - originY;
        
        let angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
        angle = Math.max(-65, Math.min(65, angle)); 
        
        tAngle = -angle;
        tJointAngle = angle * 0.7; 
        tTiltY = deltaX * 0.1; 
        tTiltX = deltaY * 0.1; 

        const currentDistance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        tStretch = Math.max(0, currentDistance - grabDistance); 
    });

    const releaseCard = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = 'default';
        lanyard.classList.replace('cursor-grabbing', 'cursor-grab');
        
        tAngle = 0; tJointAngle = 0; tTiltX = 0; tTiltY = 0; tStretch = 0;
    };

    window.addEventListener('mouseup', releaseCard);
    window.addEventListener('mouseleave', releaseCard);

    function animatePhysics() {
        vAngle += (tAngle - cAngle) * tension;
        vJointAngle += (tJointAngle - cJointAngle) * tension;
        vTiltX += (tTiltX - cTiltX) * tension;
        vTiltY += (tTiltY - cTiltY) * tension;
        vStretch += (tStretch - cStretch) * tension;

        vAngle *= friction;
        vJointAngle *= friction;
        vTiltX *= friction;
        vTiltY *= friction;
        vStretch *= friction;

        cAngle += vAngle;
        cJointAngle += vJointAngle;
        cTiltX += vTiltX;
        cTiltY += vTiltY;
        cStretch += vStretch;

        const stretchScale = (strapHeight + cStretch) / strapHeight;
        const scaleY = Math.max(0.9, stretchScale); 

        lanyard.style.transform = `rotate(${cAngle}deg)`;
        strap.style.transform = `scaleY(${scaleY})`; 
        joint.style.transform = `translateY(${cStretch}px) rotateZ(${cJointAngle}deg) rotateX(${cTiltX}deg) rotateY(${cTiltY}deg)`;

        requestAnimationFrame(animatePhysics);
    }
    animatePhysics();
}

// ============================================================
// MESIN 3D CAROUSEL (CYAN & ICE BLUE ACTIVE STATE)
// ============================================================
const cards = document.querySelectorAll('.carousel-card');
const titleDisplay = document.getElementById('active-title-display');
const playPauseBtn = document.getElementById('carousel-play-pause');
const playIcon = document.getElementById('play-icon');
const playText = document.getElementById('play-text');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

let currentIndex = 0;
let isPlaying = true;
let autoPlayInterval;
const totalCards = cards.length;

function updateCarousel() {
    cards.forEach((card, index) => {
        let dist = index - currentIndex;
        
        if (dist < -Math.floor(totalCards / 2)) dist += totalCards;
        if (dist > Math.floor(totalCards / 2)) dist -= totalCards;

        card.style.zIndex = '';
        card.style.opacity = '';
        card.style.filter = '';

        if (dist === 0) {
            // Aktif Tengah
            card.style.transform = 'translate(-50%, -50%) translateX(0) scale(1)';
            card.style.zIndex = 30;
            card.style.opacity = 1;
            card.style.filter = 'blur(0px)';
            titleDisplay.innerText = card.getAttribute('data-title');
            card.classList.remove('border-slate-800');
            card.classList.add('border-cyan-400', 'shadow-[0_0_30px_rgba(34,211,238,0.25)]');
        } else if (dist === 1) {
            // Kanan
            card.style.transform = 'translate(-50%, -50%) translateX(65%) scale(0.85)';
            card.style.zIndex = 20;
            card.style.opacity = 0.55;
            card.style.filter = 'blur(2px)';
            card.classList.remove('border-cyan-400', 'shadow-[0_0_30px_rgba(34,211,238,0.25)]');
            card.classList.add('border-slate-800');
        } else if (dist === -1) {
            // Kiri
            card.style.transform = 'translate(-50%, -50%) translateX(-65%) scale(0.85)';
            card.style.zIndex = 20;
            card.style.opacity = 0.55;
            card.style.filter = 'blur(2px)';
            card.classList.remove('border-cyan-400', 'shadow-[0_0_30px_rgba(34,211,238,0.25)]');
            card.classList.add('border-slate-800');
        } else {
            // Belakang
            card.style.transform = `translate(-50%, -50%) translateX(${dist > 0 ? '80%' : '-80%'}) scale(0.6)`;
            card.style.zIndex = 10;
            card.style.opacity = 0;
            card.classList.remove('border-cyan-400', 'shadow-[0_0_30px_rgba(34,211,238,0.25)]');
            card.classList.add('border-slate-800');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 3500);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.innerText = '⏸';
        playText.innerText = 'PAUSE TOUR';
        startAutoPlay();
    } else {
        playIcon.innerText = '▶';
        playText.innerText = 'PLAY TOUR';
        stopAutoPlay();
    }
}

if (cards.length > 0) {
    nextBtn.addEventListener('click', () => { nextSlide(); if(isPlaying) { stopAutoPlay(); startAutoPlay(); } });
    prevBtn.addEventListener('click', () => { prevSlide(); if(isPlaying) { stopAutoPlay(); startAutoPlay(); } });
    playPauseBtn.addEventListener('click', togglePlay);
    updateCarousel();
    startAutoPlay();
}

// ============================================================
// SENSOR SCROLL BLACK HOLE
// ============================================================
const blackHoleItems = document.querySelectorAll('.black-hole-item');
if (blackHoleItems.length > 0) {
    const bhObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

    blackHoleItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        bhObserver.observe(item);
    });
}

// ============================================================
// PARTICLE WAVES THREE.JS (ELECTRIC CYAN & SKY BLUE)
// ============================================================
function initParticleWaves() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;
    container.innerHTML = '';

    const SEPARATION = 85, AMOUNTX = 45, AMOUNTY = 45;
    let camera, scene, renderer;
    let particles, count = 0;

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 260, 1100);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            positions[i + 1] = 0;
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Partikel Bersih Warna Cyan-Sky
    const material = new THREE.PointsMaterial({ 
        color: 0x38bdf8, // Sky Blue terang
        size: 5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    function render() {
        const pos = particles.geometry.attributes.position.array;
        let index = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                pos[index + 1] = (Math.sin((ix + count) * 0.25) * 35) + (Math.sin((iy + count) * 0.4) * 35);
                index += 3;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.03;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

document.addEventListener("DOMContentLoaded", initParticleWaves);
