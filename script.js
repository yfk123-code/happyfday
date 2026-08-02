const sheetURL = 'https://script.google.com/macros/s/AKfycbzmEAB5hNR3o4SXJRdW02HJ-Vv1y48So_JpdVPAh0EMKRrXW7hrwb3TANrVOwiN6OOc/exec'; 
let uData = { name: "", image: "", id: "FD-2026-" + Math.floor(100000 + Math.random() * 899999) };

function nextStep(s) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`step-${s}`).classList.add('active');

    if(s === 1) openCam();
    if(s === 2) aiScan();
    if(s === 6) runMeter();
    if(s === 9) runTimer();
}

async function openCam() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        window.currentStream = stream; // Save stream to close later
    } catch(e) { alert("Camera Permission Zaruri hai!"); }

    document.getElementById('cap-btn').onclick = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; canvas.height = 400;
        ctx.drawImage(video, 0, 0, 400, 400);
        ctx.fillStyle = "rgba(188, 19, 254, 0.1)";
        ctx.fillRect(0,0,400,400);
        uData.image = canvas.toDataURL('image/png').split(',')[1];
        
        // Stop camera to save battery/resources
        window.currentStream.getTracks().forEach(track => track.stop());
        nextStep(2);
    };
}

function aiScan() {
    const logs = ["Initializing AI...", "Scanning Smile...", "Happiness Check...", "Unlimited Dosti Detected!"];
    let i = 0;
    const box = document.getElementById('ai-logs');
    let timer = setInterval(() => {
        box.innerHTML += `<p style="color:#0f0; margin:5px 0; font-size:14px;">> ${logs[i]}</p>`;
        i++;
        if(i === logs.length) {
            clearInterval(timer);
            document.getElementById('ai-res').classList.remove('hidden');
            document.getElementById('ai-next').classList.remove('hidden');
        }
    }, 1000);
}

function saveName() {
    uData.name = document.getElementById('userName').value;
    if(!uData.name) return alert("Pehle naam toh likho!");
    document.getElementById('hi-name').innerText = `Hey ${uData.name}! ❤️`;
    nextStep(4);
    startType();
}

function startType() {
    const txt = "Dosti wo nahi jo sirf waqt par saath de...\nBalki dosti wo hai jo har waqt\nsaath rehne ka wada kare.\n\nThank you for being there! ❤️";
    let i = 0;
    const box = document.getElementById('tp-box');
    box.innerText = "";
    let timer = setInterval(() => {
        box.innerText += txt[i];
        i++;
        if(i === txt.length) {
            clearInterval(timer);
            setTimeout(() => nextStep(5), 3000);
        }
    }, 50);
}

let pCount = 0;
function pillClick(el, msg) {
    if(el.classList.contains('open')) return;
    el.classList.add('open');
    el.innerHTML = `<p style="font-size:12px; padding:5px;">"${msg}"</p>`;
    pCount++;
    if(pCount === 4) document.getElementById('p-next').classList.remove('hidden');
}

function runMeter() {
    let v = 0;
    let timer = setInterval(() => {
        v += Math.floor(Math.random()*6);
        if(v >= 100) { v=100; clearInterval(timer); confetti(); setTimeout(()=>nextStep(7), 2000); }
        document.getElementById('met-val').innerText = v + "%";
    }, 100);
}

function openGift() {
    document.querySelector('.big-gift').style.display = 'none';
    document.getElementById('gift-res').classList.remove('hidden');
    confetti();
}

function genCert() {
    document.getElementById('c-name').innerText = uData.name;
    document.getElementById('cid').innerText = "ID: " + uData.id;
    document.getElementById('c-img').src = "data:image/png;base64," + uData.image;
    document.getElementById('c-qr').src = `https://api.qrserver.com/v1/create-qr-code/?data=${uData.id}`;
    
    // BACKEND SAVE
    fetch(sheetURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(uData) });
    nextStep(8);
}

function dlPNG() {
    html2canvas(document.querySelector("#certificate")).then(canvas => {
        const a = document.createElement('a');
        a.download = uData.name + '_Dosti.png';
        a.href = canvas.toDataURL();
        a.click();
    });
}

function runTimer() {
    let t = 3;
    let box = document.getElementById('timer');
    let timer = setInterval(() => {
        t--;
        box.innerText = t;
        if(t === 0) {
            clearInterval(timer);
            box.style.display = 'none';
            document.getElementById('q-text').style.display = 'none';
            document.getElementById('fin-box').classList.remove('hidden');
            confetti();
        }
    }, 1000);
}

function waShare() {
    const t = `Dekho mujhe sachi dosti ka certificate mila hai: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`);
}

function restart() {
    location.reload(); // Best way to reset camera and state
}
