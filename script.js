const scriptURL = 'https://script.google.com/macros/s/AKfycbzmEAB5hNR3o4SXJRdW02HJ-Vv1y48So_JpdVPAh0EMKRrXW7hrwb3TANrVOwiN6OOc/exec'; // PASTE NEW URL HERE
let userData = { name: "", image: "", id: "FD-2026-" + Math.floor(100000 + Math.random() * 900000) };

function nextStep(step) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    if(step === 1) startCamera();
    if(step === 2) startAIScan();
    if(step === 6) startMeter();
    if(step === 9) startFinalCounter();
}

// Camera with Auto-Focus
async function startCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    document.getElementById('capture-btn').onclick = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; canvas.height = 400;
        ctx.drawImage(video, 0, 0, 400, 400);
        
        // Apply Filter directly to data
        ctx.fillStyle = "rgba(188, 19, 254, 0.15)";
        ctx.fillRect(0, 0, 400, 400);
        
        userData.image = canvas.toDataURL('image/png').split(',')[1];
        nextStep(2);
    };
}

function startAIScan() {
    const logBox = document.getElementById('ai-logs');
    const msgs = ["Initializing Dosti-Core...", "Smile quality: Excellent!", "Scanning memories...", "Positive vibes detected!", "Friendship level: INFINITE!"];
    let i = 0;
    let timer = setInterval(() => {
        logBox.innerHTML += `<p style="color:#bc13fe; font-size:14px;">> ${msgs[i]}</p>`;
        i++;
        if(i === msgs.length) {
            clearInterval(timer);
            document.getElementById('ai-final').classList.remove('hidden');
            document.getElementById('ai-next').classList.remove('hidden');
        }
    }, 800);
}

function handleName() {
    userData.name = document.getElementById('userName').value;
    if(!userData.name) return alert("Bhai, naam toh likho!");
    document.getElementById('greet-title').innerText = `Hey ${userData.name}! ❤️`;
    nextStep(4);
    typewriter();
}

function typewriter() {
    const txt = "Dosti wo nahi jo sirf waqt par saath de... dosti wo hai jo har waqt saath rehne ka wada kare. Thank you for being there! ❤️";
    let i = 0;
    const box = document.getElementById('typewriter');
    box.innerText = "";
    let timer = setInterval(() => {
        box.innerText += txt[i];
        i++;
        if(i === txt.length) {
            clearInterval(timer);
            setTimeout(() => nextStep(5), 3000);
        }
    }, 40);
}

// Prepare Certificate BEFORE showing it
function prepareCertificate() {
    document.getElementById('cert-user-name').innerText = userData.name;
    document.getElementById('cert-id').innerText = "ID: " + userData.id;
    document.getElementById('cert-user-img').src = "data:image/png;base64," + userData.image;
    document.getElementById('cert-qr').src = `https://api.qrserver.com/v1/create-qr-code/?data=${userData.id}`;
    
    // Save to Sheet (Fire and Forget)
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(userData)
    });
    
    nextStep(8);
}

function startMeter() {
    let val = 0;
    let timer = setInterval(() => {
        val += Math.floor(Math.random() * 5);
        if(val >= 100) {
            val = 100; clearInterval(timer);
            confetti();
            setTimeout(() => nextStep(7), 2000);
        }
        document.getElementById('meter-num').innerText = val + "%";
    }, 100);
}

function openGift() {
    document.querySelector('.gift-box').style.display = 'none';
    document.getElementById('gift-reveal').classList.remove('hidden');
    confetti();
}

function downloadCert() {
    html2canvas(document.querySelector("#certificate")).then(canvas => {
        const link = document.createElement('a');
        link.download = `${userData.name}_Friendship_Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function startFinalCounter() {
    let time = 3;
    const box = document.getElementById('final-timer');
    let timer = setInterval(() => {
        time--;
        box.innerText = time;
        if(time === 0) {
            clearInterval(timer);
            box.style.display = 'none';
            document.getElementById('final-q').style.display = 'none';
            document.getElementById('creator-box').classList.remove('hidden');
            confetti();
        }
    }, 1000);
}

function tapCard(el, msg) {
    if(el.classList.contains('opened')) return;
    el.classList.add('opened');
    el.innerHTML = `<p style="font-size:12px;">"${msg}"</p>`;
    if(document.querySelectorAll('.f-card.opened').length === 4) 
        document.getElementById('card-next').classList.remove('hidden');
}

function shareWA() {
    const txt = `Dekh! Mujhe sachi dosti ka certificate mila hai. Tu bhi try kar: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`);
}
