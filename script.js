let canvas, ctx, writing = false;

document.addEventListener('DOMContentLoaded', () => {
    // Ημερομηνία & Άφιξη
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    // Setup Υπογραφής
    canvas = document.getElementById('signature-pad');
    ctx = canvas.getContext('2d');
    
    // Διόρθωση ανάλυσης canvas
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || e.touches[0].clientX) - rect.left,
            y: (e.clientY || e.touches[0].clientY) - rect.top
        };
    };

    const start = (e) => {
        writing = true;
        setDepartureTime();
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        if(e.type === 'touchstart') e.preventDefault();
    };

    const move = (e) => {
        if (!writing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        if(e.type === 'touchmove') e.preventDefault();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', () => writing = false);
    
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', () => writing = false);
});

function setDepartureTime() {
    const dep = document.getElementById('departure-time');
    if (dep.innerText === '--:--') {
        dep.innerText = new Date().toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});
    }
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleBtn(btn, type) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active-yes', 'active-no'));
    btn.classList.add(type === 'yes' ? 'active-yes' : 'active-no');
}

function generatePDF() {
    const btn = document.getElementById('btn-generate');
    const clearBtn = document.querySelector('.btn-clear');
    
    // Κρύβουμε τα κουμπιά προσωρινά
    btn.style.display = 'none';
    clearBtn.style.display = 'none';

    const element = document.body;
    const customer = document.getElementById('customer').value || 'Report';

    const opt = {
        margin: [10, 10],
        filename: `GB_Experts_${customer}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Επαναφέρουμε τα κουμπιά
        btn.style.display = 'block';
        clearBtn.style.display = 'block';
    });
}
