
document.addEventListener('DOMContentLoaded', () => {
    // 1. Ρύθμιση Ημερομηνίας
    const dateField = document.getElementById('current-date');
    const now = new Date();
    
    const formattedDate = now.toLocaleDateString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    if (dateField) dateField.innerText = formattedDate;

    // 2. Ρύθμιση Ώρας Άφιξης
    const arrivalField = document.getElementById('arrival-time');
    const formattedTime = now.toLocaleTimeString('el-GR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    if (arrivalField) arrivalField.innerText = formattedTime;

    console.log("G&B Experts App: Ημερομηνία και Ώρα Άφιξης καταγράφηκαν.");
});

/**
 * Αυτή η συνάρτηση θα καλείται στο μέλλον 
 * όταν ο χρήστης ολοκληρώνει την υπογραφή.
 */
function setDepartureTime() {
    const departureField = document.getElementById('departure-time');
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('el-GR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    if (departureField) departureField.innerText = formattedTime;
}
