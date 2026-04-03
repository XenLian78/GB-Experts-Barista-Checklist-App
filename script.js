let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progress-bar");
let sigPadTech, sigPadClient;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Date & Arrival Time
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    // 2. Initialize Signatures
    sigPadTech = new SignaturePad(document.getElementById('sig-canvas-tech'));
    sigPadClient = new SignaturePad(document.getElementById('sig-canvas-client'));

    // Προσαρμογή μεγέθους canvas
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [document.getElementById('sig-canvas-tech'), document.getElementById('sig-canvas-client')].forEach(canvas => {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

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

// PDF Export
async function finishAndExport() {
    // Ωρα αναχώρησης
    const now = new Date();
    document.getElementById('departure-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    alert("Δημιουργία PDF... Παρακαλώ περιμένετε.");

    // Εμφανίζουμε όλα τα steps για να τα "φωτογραφίσει" το html2canvas
    steps.forEach(s => s.classList.add("active"));
    document.querySelector(".nav-buttons").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";

    try {
        const canvas = await html2canvas(document.body, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Checklist_${document.getElementById('customer').value || 'Report'}.pdf`);
    } catch (err) {
        console.error("Σφάλμα δημιουργίας PDF: ", err);
        alert("Υπήρξε πρόβλημα κατά την εξαγωγή του PDF.");
    }

    // Επαναφορά UI
    steps.forEach((s, idx) => {
        if (idx === steps.length - 1) s.classList.add("active");
        else s.classList.remove("active");
    });
    document.querySelector(".nav-buttons").style.display = "flex";
    document.querySelector(".progress-container").style.display = "block";
}
