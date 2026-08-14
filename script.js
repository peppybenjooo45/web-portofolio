AOS.init({ once: true, offset: 100, duration: 800, easing: 'ease-out-cubic' });

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('bg-slate-900/80', 'backdrop-blur-md', 'border-b', 'border-slate-800', 'shadow-lg');
    } else {
        nav.classList.remove('bg-slate-900/80', 'backdrop-blur-md', 'border-b', 'border-slate-800', 'shadow-lg');
    }
});

// ============================================================
// MESIN FISIKA EFEK KARET MELAR (Rubber Band Physics) ID CARD
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
// MESIN 3D CAROUSEL AUTOPLAY (Seperti Referensi Gambar)
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

        // PERBAIKAN: Menambahkan translate(-50%, -50%) agar poros putaran tetap berada di tengah persis
        if (dist === 0) {
            // Posisi Tengah (Aktif)
            card.style.transform = 'translate(-50%, -50%) translateX(0) scale(1)';
            card.style.zIndex = 30;
            card.style.opacity = 1;
            card.style.filter = 'blur(0px)';
            titleDisplay.innerText = card.getAttribute('data-title');
            card.classList.replace('border-slate-700', 'border-blue-500/50');
        } else if (dist === 1) {
            // Posisi Kanan (Next)
            card.style.transform = 'translate(-50%, -50%) translateX(65%) scale(0.85)';
            card.style.zIndex = 20;
            card.style.opacity = 0.6;
            card.style.filter = 'blur(2px)';
            card.classList.replace('border-blue-500/50', 'border-slate-700');
        } else if (dist === -1) {
            // Posisi Kiri (Prev)
            card.style.transform = 'translate(-50%, -50%) translateX(-65%) scale(0.85)';
            card.style.zIndex = 20;
            card.style.opacity = 0.6;
            card.style.filter = 'blur(2px)';
            card.classList.replace('border-blue-500/50', 'border-slate-700');
        } else {
            // Sembunyi di Belakang (Lebih dari Kiri/Kanan)
            card.style.transform = `translate(-50%, -50%) translateX(${dist > 0 ? '80%' : '-80%'}) scale(0.6)`;
            card.style.zIndex = 10;
            card.style.opacity = 0;
            card.classList.replace('border-blue-500/50', 'border-slate-700');
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
    autoPlayInterval = setInterval(nextSlide, 3500); // Ganti slide tiap 3.5 detik
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.innerText = '⏸';
        playText.innerText = 'PAUSE TOUR';
        playPauseBtn.classList.replace('bg-blue-600', 'bg-pink-600');
        startAutoPlay();
    } else {
        playIcon.innerText = '▶';
        playText.innerText = 'PLAY TOUR';
        playPauseBtn.classList.replace('bg-pink-600', 'bg-blue-600');
        stopAutoPlay();
    }
}

if (cards.length > 0) {
    // Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        if(isPlaying) { stopAutoPlay(); startAutoPlay(); } // Reset timer
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        if(isPlaying) { stopAutoPlay(); startAutoPlay(); }
    });
    
    playPauseBtn.addEventListener('click', togglePlay);

    // Inisialisasi awal
    updateCarousel();
    startAutoPlay();
}


// ============================================================
// PARTICLE WAVES BACKGROUND (THREE.JS)
// ============================================================
function initParticleWaves() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
    let camera, scene, renderer;
    let particles, count = 0;

    // 1. Setup Camera & Scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 300; // Agak menunduk ke bawah
    scene = new THREE.Scene();

    // 2. Setup Partikel (Warna Ungu/Biru)
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

   // Membuat material partikel berbentuk titik dengan warna Silver/Abu-abu estetik
    const material = new THREE.PointsMaterial({ 
        color: 0x9ca3af, // Warna abu-abu silver
        size: 8,
        sizeAttenuation: true 
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Setup Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha: true agar background transparan
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Animasi (Persis seperti logika di gambar yang kamu temukan)
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Logika gelombang sinus seperti di kode yang kamu temukan
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
                i += 3;
                j++;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        
        renderer.render(scene, camera);
        count += 0.05; // Kecepatan gelombang
    }

    // 5. Responsif saat layar di-resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mulai animasi
    animate();
}

// Jalankan fungsi saat web dimuat
document.addEventListener("DOMContentLoaded", initParticleWaves);



// ============================================================
// SENSOR SCROLL EFEK BLACK HOLE (PENGALAMAN KERJA)
// ============================================================
const blackHoleItems = document.querySelectorAll('.black-hole-item');

if (blackHoleItems.length > 0) {
    const bhObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Saat elemen masuk layar, tambahkan class .in-view
                entry.target.classList.add('in-view');
            } else {
                // (Opsional) Hapus komentar di bawah jika ingin kartunya 
                // tersedot kembali ke black hole saat Anda scroll ke atas/bawah
                // entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.1, // Memicu saat 10% kartu mulai terlihat di layar
        rootMargin: "0px 0px -100px 0px" // Sedikit menunda kemunculan agar pas di tengah layar
    });

    blackHoleItems.forEach((item, index) => {
        // Memberikan delay berurutan agar kartunya keluar satu per satu
        item.style.transitionDelay = `${index * 0.2}s`;
        bhObserver.observe(item);
    });
}
