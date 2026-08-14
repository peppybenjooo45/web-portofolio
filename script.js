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
// LOGIKA INTERAKTIF PROYEK (Tampil Satu Per Satu / Pola Tangga)
// ============================================================
const btnStart = document.getElementById('btn-start-projects');
const projectsGrid = document.getElementById('projects-grid');
const controls = document.getElementById('project-controls');
const btnNext = document.getElementById('btn-next-project');
const textDone = document.getElementById('text-done');

const projectCards = [
    document.getElementById('project-1'),
    document.getElementById('project-2'),
    document.getElementById('project-3')
];

let currentStep = 0;

function showNextProject() {
    if (currentStep < projectCards.length) {
        const card = projectCards[currentStep];
        card.classList.remove('opacity-0', 'translate-y-10');
        card.classList.add('opacity-100', 'translate-y-0');
        
        currentStep++;

        if (currentStep === projectCards.length) {
            btnNext.classList.add('hidden');
            textDone.classList.remove('hidden');
        }
    }
}

if (btnStart && btnNext) {
    btnStart.addEventListener('click', () => {
        btnStart.classList.add('opacity-0', 'scale-90');
        setTimeout(() => {
            btnStart.classList.add('hidden');
            projectsGrid.classList.remove('hidden');
            void projectsGrid.offsetWidth; 
            projectsGrid.classList.remove('opacity-0');
            
            controls.classList.remove('hidden');
            void controls.offsetWidth;
            controls.classList.remove('opacity-0');

            setTimeout(showNextProject, 300);
        }, 300);
    });

    btnNext.addEventListener('click', () => {
        showNextProject();
        if (window.innerWidth < 768) {
            const latestCard = projectCards[currentStep - 1];
            latestCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}
