let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progress-bar");
let sigPadTech, sigPadClient;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Date & Arrival Time
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    // 2. Initialize Signatures Container
    const canvasTech = document.getElementById('sig-canvas-tech');
    const canvasClient = document.getElementById('sig-canvas-client');
    sigPadTech = new SignaturePad(canvasTech);
    sigPadClient = new SignaturePad(canvasClient);

    // Προσαρμογή μεγέθους canvas (Βελτιωμένο ώστε να αποθηκεύει την υπογραφή αν γίνει resize)
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasTech, canvasClient].forEach(canvas => {
            // Κάνει resize μόνο αν ο καμβάς είναι ορατός
            if (canvas.offsetWidth > 0) {
                const pad = canvas.id === 'sig-canvas-tech' ? sigPadTech : sigPadClient;
                const data = pad ? pad.toData() : null;
                
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
                
                if (pad && data && data.length > 0) {
                    pad.fromData(data);
                }
            }
        });
    }
    // Εκθέτουμε τη συνάρτηση globally για να την καλέσουμε όταν εμφανιστεί η Οθόνη 6
    window.resizeCanvas = resizeCanvas; 
    window.addEventListener("resize", resizeCanvas);

    // 3. Load Saved Data from LocalStorage
    loadSavedData();

    // 4. Color Check for Selects
    document.querySelectorAll('.custom-select').forEach(select => updateSelectColor(select));

    showStep(currentStep);
});

function showStep(n) {
    steps.forEach((step, index) => {
        if (index === n) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
    });

    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    
    if (n === (steps.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "ΟΛΟΚΛΗΡΩΣΗ & PDF";
        document.getElementById("nextBtn").style.backgroundColor = "var(--success)";
        
        // ΛΥΣΗ ΓΙΑ SIGNATURE PAD: Κάνουμε resize τον καμβά ΜΟΛΙΣ εμφανιστεί η Οθόνη 6
        setTimeout(() => {
            if(window.resizeCanvas) window.resizeCanvas();
        }, 50);
    } else {
        document.getElementById("nextBtn").innerHTML = "Επόμενο";
        document.getElementById("nextBtn").style.backgroundColor = "var(--gb-blue)";
    }
    
    // Update Progress Bar
    let pct = ((n + 1) / steps.length) * 100;
    progressBar.style.width = pct + "%";
}

function nextPrev(n) {
    if (n === 1 && !validateForm()) return false;

    currentStep = currentStep + n;

    if (currentStep >= steps.length) {
        finishAndExport();
        currentStep = steps.length - 1; // Prevent going out of bounds
        return false;
    }
    showStep(currentStep);
    window.scrollTo(0, 0);
}

function validateForm() {
    let valid = true;
    let inputs = steps[currentStep].querySelectorAll("input[required]");
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = "var(--danger)";
            valid = false;
        } else {
            input.style.borderColor = "#ccc";
        }
    });
    return valid;
}

// Χρώμα Select: Ροζ αν κενό, Πράσινο αν επιλεγμένο
function updateSelectColor(select) {
    if (select.value === "") {
        select.classList.remove("completed");
    } else {
        select.classList.add("completed");
    }
    saveCurrentData();
}

// Toggle Buttons Logic
function setToggle(btn, val) {
    const parent = btn.parentElement;
    parent.querySelectorAll('button').forEach(b => b.classList.remove('active-yes', 'active-no'));
    
    if (val === 'NAI') btn.classList.add('active-yes');
    else btn.classList.add('active-no');
    
    parent.setAttribute('data-value', val);
    saveCurrentData();
}

function clearSig(type) {
    if (type === 'tech') sigPadTech.clear();
    else sigPadClient.clear();
}

// Local Storage
function saveCurrentData() {
    let data = {};
    document.querySelectorAll(".stored").forEach(el => {
        data[el.id] = el.value;
    });
    // Save toggles
    document.querySelectorAll(".toggle-group").forEach(el => {
        data[el.getAttribute('data-id')] = el.getAttribute('data-value');
    });
    localStorage.setItem("gb_checklist_draft", JSON.stringify(data));
}

function loadSavedData() {
    let saved = localStorage.getItem("gb_checklist_draft");
    if (!saved) return;
    let data = JSON.parse(saved);
    
    document.querySelectorAll(".stored").forEach(el => {
        if (data[el.id]) el.value = data[el.id];
    });

    document.querySelectorAll(".toggle-group").forEach(el => {
        let id = el.getAttribute('data-id');
        if (data[id]) {
            el.setAttribute('data-value', data[id]);
            el.querySelectorAll('button').forEach(btn => {
                if (btn.innerText === data[id]) {
                    btn.classList.add(data[id] === 'NAI' ? 'active-yes' : 'active-no');
                }
            });
        }
    });
}

// ΥΠΕΡ-ΒΕΛΤΙΣΤΟΠΟΙΗΜΕΝΗ ΛΕΙΤΟΥΡΓΙΑ PDF
async function finishAndExport() {
    // Ώρα αναχώρησης
    const now = new Date();
    document.getElementById('departure-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    alert("Δημιουργία PDF... Παρακαλώ περιμένετε.");

    // 1. Προετοιμασία UI για λήψη της "φωτογραφίας"
    window.scrollTo(0, 0);
    steps.forEach(s => {
        s.style.animation = "none"; // Απενεργοποίηση animation για να φανούν άμεσα
        s.classList.add("active");
    });
    
    document.querySelector(".nav-buttons").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";

    // 2. Δίνουμε ελάχιστο χρόνο στον browser να εμφανίσει όλα τα πεδία πριν φωτογραφίσει (κρίσιμο για το iPad)
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Χρησιμοποιούμε κλίμακα 1.5 για ταχύτητα & μνήμη. Και scrollY 0 για να μην κοπεί τίποτα
        const canvas = await html2canvas(document.body, { 
            scale: 1.5,
            useCORS: true,
            scrollY: 0,
            windowHeight: document.documentElement.scrollHeight
        });
        
        // Το JPEG μορφότυπο μειώνει τον χρόνο δημιουργίας στο 1/10 σε σχέση με το PNG
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        
        const { jsPDF } = window.jspdf;
        
        // 3. Υπολογισμός διαστάσεων - Εδώ λύνεται το κόψιμο στη μέση της σελίδας
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = 210; // Standard A4 Width (mm)
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        // Ορίζουμε δυναμικό ύψος σελίδας αντί για το κλασικό A4, ώστε να χωράει ΟΛΗ η λίστα σε μία συνεχόμενη ροή
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Checklist_${document.getElementById('customer').value || 'Report'}.pdf`);
    } catch (err) {
        console.error("Σφάλμα δημιουργίας PDF: ", err);
        alert("Υπήρξε πρόβλημα κατά την εξαγωγή του PDF.");
    }

    // 4. Επαναφορά του UI στην τελική οθόνη (6)
    steps.forEach((s, idx) => {
        s.style.animation = ""; // Επαναφορά css animations
        if (idx === steps.length - 1) s.classList.add("active");
        else s.classList.remove("active");
    });
    
    document.querySelector(".nav-buttons").style.display = "flex";
    document.querySelector(".progress-container").style.display = "block";
}
