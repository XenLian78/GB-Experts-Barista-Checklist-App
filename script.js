document.addEventListener('DOMContentLoaded', () => {
    // Αυτόματη Ημερομηνία & Ώρα
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});
});

// Λογική για την αλλαγή χρώματος στα κουμπιά
function toggleBtn(btn, type) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('.btn-toggle');
    
    buttons.forEach(b => {
        b.classList.remove('active-yes', 'active-no');
    });

    if (type === 'yes') {
        btn.classList.add('active-yes');
    } else {
        btn.classList.add('active-no');
    }
}
