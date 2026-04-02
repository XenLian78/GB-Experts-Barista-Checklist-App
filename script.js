let signatureData = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ημερομηνία & Άφιξη
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    // 2. Setup Υπογραφής
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let writing = false;

    // Προσαρμογή μεγέθους canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function startDrawing(e) {
        writing = true;
        setDepartureTime(); // Μόλις ακουμπήσει για υπογραφή, μπαίνει η ώρα αναχώρησης
        draw(e);
    }

    function draw(e) {
        if (!writing) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => { writing = false; ctx.beginPath(); });
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', () => { writing = false; ctx.beginPath(); });
});

function clearSignature() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setDepartureTime() {
    const depField = document.getElementById('departure-time');
    if (depField.innerText === '--:--') {
        const now = new Date();
        depField.innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});
    }
}

// 4. ΔΗΜΙΟΥΡΓΙΑ PDF
function generatePDF() {
    const element = document.getElementById('app-content');
    const customerName = document.getElementById('customer').value || 'Report';
    
    const opt = {
        margin: 10,
        filename: `G-B_Report_${customerName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function toggleBtn(btn, type) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active-yes', 'active-no'));
    btn.classList.add(type === 'yes' ? 'active-yes' : 'active-no');
}
