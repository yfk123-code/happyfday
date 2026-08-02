const scriptURL = 'YOUR_APPS_SCRIPT_URL_HERE'; // APNA URL DALEIN
let userData = { name: "", image: "", id: "FD-2026-" + Math.floor(100000 + Math.random() * 900000) };

function nextStep(step) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`step-${step}`);
    target.classList.add('active');

    if(step === 1) initCamera();
    if(step === 2) startAIScan();
    if(step === 6) startMeter();
}

// Camera Setup with Filter
async function initCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    document.getElementById('capture-btn').onclick = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; canvas.height = 400;
        
        // Applying Filter to captured image
        ctx.filter = "sepia(0.2) saturate(1.5) hue-rotate(-20deg)";
        ctx.drawImage(video, 0, 0, 400, 400);
        
        // Add Frame Text
        ctx.filter = "none";
        ctx.fillStyle = "rgba(142, 45, 226, 0.7)";
        ctx.fillRect(0, 360, 400, 40);
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Outfit";
        ctx.fillText("✨ FRIENDSHIP DAY 2026 ✨", 80, 385);

        userData.image = canvas.toDataURL('image/png').split(',')[1];
        nextStep(2);
    };
}

// AI Scanner Hinglish
function startAIScan() {
    const logs = ["System initialize ho raha hai...", "Smile scan ki ja rahi hai...", "Happiness levels check ho rahe hain...", "Positive energy detect ho gayi!", "Friendship level: UNLIMITED"];
    const logBox = document.getElementById('ai-logs');
    let i = 0;
    const interval = setInterval(() => {
        logBox.innerHTML += `<p style="color:#0f0; font-size:14px; text-align:left;">> ${logs[i]}</p>`;
        i++;
        if(i === logs.length) {
            clearInterval(interval);
            document.getElementById('ai-result').classList.remove('hidden');
            document.getElementById('ai-btn').classList.remove('hidden');
        }
    }, 1000);
}

// Name Handler
function handleName() {
    userData.name = document.getElementById('userName').value;
    if(!userData.name) return alert("Pehle naam toh batao!");
    document.getElementById('greet-name').innerText = `Hey ${userData.name} ❤️`;
    nextStep(4);
    startTypewriter();
}

function startTypewriter() {
    const text = "Dosti sirf usse nahi kehte jise aap bachpan se jante ho... balki usse kehte hain jo aapka saath kabhi nahi chhodta.";
    let i = 0;
    const target = document.getElementById('typewriter');
    const timer = setInterval(() => {
        target.innerText += text[i];
        i++;
        if(i === text.length) {
            clearInterval(timer);
            setTimeout(() => nextStep(5), 2500);
        }
    }, 50);
}

// Cards Logic
let cardsCount = 0;
function openCard(el, msg) {
    if(el.classList.contains('open')) return;
    el.classList.add('open');
    el.innerHTML = `<p style="font-size:12px;">"${msg}"</p>`;
    cardsCount++;
    if(cardsCount === 4) document.getElementById('card-btn').classList.remove('hidden');
}

// Meter Logic
function startMeter() {
    let val = 0;
    const fill = document.getElementById('meter-fill');
    const num = document.getElementById('meter-num');
    const interval = setInterval(() => {
        val += Math.floor(Math.random()*7);
        if(val >= 100) {
            val = 100;
            clearInterval(interval);
            document.getElementById('meter-status').innerText = "ERROR: UNLIMITED DOSTI FOUND! ❤️";
            confetti();
            setTimeout(() => nextStep(7), 2500);
        }
        fill.style.width = val + "%";
        num.innerText = val + "%";
    }, 150);
}

function openGift() {
    document.querySelector('.gift-container').classList.add('hidden');
    document.getElementById('gift-reveal').classList.remove('hidden');
    confetti();
}

// Certificate & Sheet Fix
function downloadCert() {
    document.getElementById('c-name').innerText = userData.name;
    document.getElementById('fid').innerText = "ID: " + userData.id;
    document.getElementById('c-img').src = "data:image/png;base64," + userData.image;
    document.getElementById('qr').src = `https://api.qrserver.com/v1/create-qr-code/?data=${userData.id}`;

    // Send Data to Sheet (No-Cors Fix)
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(userData)
    });

    html2canvas(document.querySelector("#certificate")).then(canvas => {
        const a = document.createElement('a');
        a.download = 'Friendship_Certificate.png';
        a.href = canvas.toDataURL();
        a.click();
    });
}

function shareWA() {
    const text = `Dekho mujhe sachi dosti ka certificate mila hai! Aap bhi check karo: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}
