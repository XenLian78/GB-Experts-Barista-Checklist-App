let currentStep = 0;
let steps, progressBar, sigPadTech, sigPadClient;

document.addEventListener("DOMContentLoaded", () => {
    steps = document.querySelectorAll(".form-step");
    progressBar = document.getElementById("progress-bar");

    // 1. Ημερομηνία & Ώρα Άφιξης
    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('el-GR');
    document.getElementById('arrival-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    // 2. Αρχικοποίηση Υπογραφών
    const canvasTech = document.getElementById('sig-canvas-tech');
    const canvasClient = document.getElementById('sig-canvas-client');
    sigPadTech = new SignaturePad(canvasTech);
    sigPadClient = new SignaturePad(canvasClient);

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasTech, canvasClient].forEach(canvas => {
            if (canvas.offsetWidth > 0) {
                const pad = canvas.id === 'sig-canvas-tech' ? sigPadTech : sigPadClient;
                const data = pad ? pad.toData() : null;
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
                if (pad && data && data.length > 0) pad.fromData(data);
            }
        });
    }
    window.resizeCanvas = resizeCanvas;
    window.addEventListener("resize", resizeCanvas);

    // 3. Φόρτωση δεδομένων & Έλεγχος χρωμάτων
    loadSavedData();
    document.querySelectorAll('.custom-select').forEach(select => updateSelectColor(select));

    // 4. Εμφάνιση πρώτου βήματος
    showStep(currentStep);
});

function showStep(n) {
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === n);
    });

    // Διόρθωση εμφάνισης κουμπιού "Πίσω"
    const prevBtn = document.getElementById("prevBtn");
    if (n === 0) {
        prevBtn.style.visibility = "hidden"; // Χρησιμοποιούμε visibility για να μην κουνιέται το Next
    } else {
        prevBtn.style.visibility = "visible";
    }

    const nextBtn = document.getElementById("nextBtn");
    if (n === (steps.length - 1)) {
        nextBtn.innerHTML = "ΟΛΟΚΛΗΡΩΣΗ & PDF";
        nextBtn.style.backgroundColor = "var(--success)";
        setTimeout(() => { if(window.resizeCanvas) window.resizeCanvas(); }, 100);
    } else {
        nextBtn.innerHTML = "Επόμενο";
        nextBtn.style.backgroundColor = "var(--gb-blue)";
    }

    let pct = ((n + 1) / steps.length) * 100;
    progressBar.style.width = pct + "%";
}

function nextPrev(n) {
    // Αν πάμε μπροστά, κάνουμε έλεγχο εγκυρότητας
    if (n === 1 && !validateForm()) {
        alert("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία με το κόκκινο περίγραμμα.");
        return false;
    }

    currentStep = currentStep + n;

    if (currentStep >= steps.length) {
        finishAndExport();
        currentStep = steps.length - 1;
        return false;
    }
    showStep(currentStep);
    window.scrollTo(0, 0);
}

function validateForm() {
    let valid = true;
    let currentStepEl = steps[currentStep];
    let requiredInputs = currentStepEl.querySelectorAll("input[required]");

    requiredInputs.forEach(input => {
        if (input.value.trim() === "") {
            input.style.border = "2px solid var(--danger)";
            valid = false;
        } else {
            input.style.border = "1px solid #ccc";
        }
    });
    return valid;
}

// Real-time έλεγχος για να φεύγει το κόκκινο πλαίσιο καθώς πληκτρολογείς
document.addEventListener("input", (e) => {
    if (e.target.hasAttribute("required")) {
        if (e.target.value.trim() !== "") {
            e.target.style.border = "1px solid #ccc";
        } else {
            e.target.style.border = "2px solid var(--danger)";
        }
    }
    if (e.target.classList.contains("stored")) {
        saveCurrentData();
    }
});

function updateSelectColor(select) {
    select.classList.toggle("completed", select.value !== "");
    saveCurrentData();
}

function setToggle(btn, val) {
    const parent = btn.parentElement;
    parent.querySelectorAll('button').forEach(b => b.classList.remove('active-yes', 'active-no'));
    btn.classList.add(val === 'NAI' ? 'active-yes' : 'active-no');
    parent.setAttribute('data-value', val);
    saveCurrentData();
}

function clearSig(type) {
    if (type === 'tech') sigPadTech.clear();
    else sigPadClient.clear();
}

function saveCurrentData() {
    let data = {};
    document.querySelectorAll(".stored").forEach(el => {
        data[el.id] = el.value;
    });
    document.querySelectorAll(".toggle-group").forEach(el => {
        if (el.getAttribute('data-value')) {
            data[el.getAttribute('data-id')] = el.getAttribute('data-value');
        }
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
        let val = data[id];
        if (val) {
            el.setAttribute('data-value', val);
            el.querySelectorAll('button').forEach(btn => {
                if (btn.innerText === val) {
                    btn.classList.add(val === 'NAI' ? 'active-yes' : 'active-no');
                }
            });
        }
    });
}

async function finishAndExport() {
    const now = new Date();
    document.getElementById('departure-time').innerText = now.toLocaleTimeString('el-GR', {hour: '2-digit', minute:'2-digit'});

    alert("Δημιουργία PDF... Παρακαλώ περιμένετε.");

    window.scrollTo(0, 0);
    steps.forEach(s => {
        s.style.animation = "none";
        s.classList.add("active");
    });
    
    document.querySelector(".nav-buttons").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const canvas = await html2canvas(document.body, { 
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowHeight: document.documentElement.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const { jsPDF } = window.jspdf;
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = 210; 
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Checklist_${document.getElementById('customer').value || 'Report'}.pdf`);
    } catch (err) {
        console.error(err);
        alert("Σφάλμα PDF.");
    }

    steps.forEach((s, idx) => {
        s.style.animation = "";
        s.classList.toggle("active", idx === steps.length - 1);
    });
    
    document.querySelector(".nav-buttons").style.display = "flex";
    document.querySelector(".progress-container").style.display = "block";
}
