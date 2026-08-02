const scriptURL = 'https://script.google.com/macros/s/AKfycbzmEAB5hNR3o4SXJRdW02HJ-Vv1y48So_JpdVPAh0EMKRrXW7hrwb3TANrVOwiN6OOc/exec'; // APNA URL YAHAN DALEIN
let userData = { name: "", image: "", id: "FD-2026-" + Math.floor(Math.random()*900000) };

function nextStep(step) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    updateProgress(step);
    
    if(step === 1) setupCamera();
    if(step === 2) runAIScan();
    if(step === 6) runMeter();
}

function updateProgress(step) {
    const segs = document.querySelectorAll('.seg');
    segs.forEach((s, i) => i <= step ? s.classList.add('active') : s.classList.remove('active'));
}

async function setupCamera() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (e) { alert("Camera access denied!"); }

    document.getElementById('btn-capture').onclick = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; canvas.height = 400;
        
        // Filter logic: Video draw karo + overlay text
        ctx.drawImage(video, 0, 0, 400, 400);
        ctx.fillStyle = "rgba(142, 45, 226, 0.3)";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "white";
        ctx.font = "20px Outfit";
        ctx.fillText("✨ Friendship Day 2026 ✨", 90, 380);
        
        userData.image = canvas.toDataURL('image/png').split(',')[1];
        nextStep(2);
    };
}

function runAIScan() {
    const status = document.getElementById('ai-status');
    const logs = ["Initializing...", "Scanning smile...", "Checking happiness...", "Detecting positive energy...", "Calculating friendship level..."];
    let i = 0;
    let timer = setInterval(() => {
        status.innerHTML += `<p>✅ ${logs[i]}</p>`;
        i++;
        if(i === logs.length) {
            clearInterval(timer);
            document.getElementById('ai-result').classList.remove('hidden');
            document.getElementById('ai-continue').classList.remove('hidden');
        }
    }, 800);
}

function processName() {
    userData.name = document.getElementById('userName').value;
    if(!userData.name) return alert("Pehle naam toh likho!");
    document.getElementById('greet-name').innerText = `Hey ${userData.name} ❤️`;
    nextStep(4);
    typewriter();
}

function typewriter() {
    const text = "Dosti sirf usse nahi kehte jise aap bachpan se jante ho... balki usse kehte hain jo aapka saath kabhi nahi chhodta.";
    let i = 0;
    const box = document.getElementById('typewriter');
    let timer = setInterval(() => {
        box.innerHTML += text[i];
        i++;
        if(i === text.length) { 
            clearInterval(timer); 
            setTimeout(() => nextStep(5), 2000); 
        }
    }, 50);
}

let cardsOpened = 0;
function openCard(el, msg) {
    if(el.classList.contains('opened')) return;
    el.classList.add('opened');
    el.innerHTML = `<p style="font-size:12px; padding:10px;">"${msg}"</p>`;
    cardsOpened++;
    if(cardsOpened === 4) document.getElementById('card-continue').classList.remove('hidden');
}

function runMeter() {
    let val = 0;
    let fill = document.getElementById('meter-fill');
    let text = document.getElementById('meter-text');
    let timer = setInterval(() => {
        val += Math.floor(Math.random()*5) + 2;
        if(val >= 100) {
            val = 100; clearInterval(timer);
            document.getElementById('meter-msg').innerText = "ERROR: UNLIMITED DOSTI FOUND ❤️";
            confetti();
            setTimeout(() => nextStep(7), 2500);
        }
        fill.style.width = val + "%";
        text.innerText = val + "%";
    }, 100);
}

function openGift() {
    document.querySelector('.gift-box-3d').style.display = 'none';
    document.getElementById('gift-msg').classList.remove('hidden');
    confetti();
}

function downloadCert() {
    // Certificate values set karna
    document.getElementById('cert-user-name').innerText = userData.name;
    document.getElementById('c-id').innerText = userData.id;
    document.getElementById('cert-img').src = "data:image/png;base64," + userData.image;
    document.getElementById('qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?data=${userData.id}`;

    // Sheet me data bhejna (Fixing the data saving)
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Ye allow karega background data sending
        body: JSON.stringify(userData)
    });

    // Capture Certificate
    html2canvas(document.querySelector("#certificate")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Dosti_Certificate.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function shareWA() {
    let text = `Hey! Dekho mujhe Friendship Certificate mila hai! Tum bhi try karo: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}