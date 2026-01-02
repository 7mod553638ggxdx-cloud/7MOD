// 1. نظام الحماية
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};

// 2. خريطة تحويل الحروف (عربي <-> إنجليزي)
const keyMap = {
    'A': 'ش', 'B': 'لا', 'C': 'ؤ', 'D': 'ي', 'E': 'ث', 'F': 'ب', 'G': 'ل', 'H': 'ا',
    'I': 'ه', 'J': 'ت', 'K': 'ن', 'L': 'م', 'M': 'ة', 'N': 'ى', 'O': 'خ', 'P': 'ح',
    'Q': 'ض', 'R': 'ق', 'S': 'س', 'T': 'ف', 'U': 'ع', 'V': 'ر', 'W': 'ص', 'X': 'ء',
    'Y': 'غ', 'Z': 'ئ'
};

const getEquivalentKey = (key) => {
    key = key.toUpperCase();
    if (keyMap[key]) return keyMap[key];
    for (let eng in keyMap) { if (keyMap[eng] === key) return eng; }
    return null;
};

// 3. وظيفة الصوت (قوية)
const playTickSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = 'sine'; 
    oscillator.frequency.setValueAtTime(1000, context.currentTime);
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.15);
};

// 4. العدادات والمتغيرات
let day = parseInt(localStorage.getItem('day')) || 0;
let week = parseInt(localStorage.getItem('week')) || 0;
let total = parseInt(localStorage.getItem('total')) || 0;
let isWaiting = false; // متغير للتحكم في زمن الانتظار

const updateUI = () => {
    document.getElementById('day-tickets').innerText = day;
    document.getElementById('week-tickets').innerText = week;
    document.getElementById('total-tickets').innerText = total;
    localStorage.setItem('day', day); localStorage.setItem('week', week); localStorage.setItem('total', total);
};

// 5. وظيفة الحساب مع "زمن الانتظار"
const processTicket = () => {
    if (isWaiting) return; // إذا كان في فترة انتظار، اخرج ولا تفعل شيء

    playTickSound();
    day++; week++; total++;
    updateUI();

    // تفعيل وضع الانتظار
    isWaiting = true;
    let waitTime = parseFloat(document.getElementById('wait-val').innerText) * 1000;
    
    // تأثير بصري للزر المختار أثناء الانتظار
    let btn = document.getElementById('selected-btn');
    btn.style.opacity = "0.3";

    setTimeout(() => {
        isWaiting = false;
        btn.style.opacity = "1";
    }, waitTime);
};

// 6. مستمع الكيبورد (عربي + إنجليزي)
document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT') {
        let pressedKey = e.key.toUpperCase();
        let selectedChar = document.getElementById('selected-btn').innerText.trim().toUpperCase();
        let equivalent = getEquivalentKey(selectedChar);

        if (pressedKey === selectedChar || pressedKey === equivalent) {
            processTicket();
        }
    }
});

// 7. باقي أزرار التحكم
document.getElementById('selected-btn').onclick = () => { processTicket(); };

document.getElementById('update-btn-name').onclick = () => {
    let n = document.getElementById('btn-input').value;
    if(n) { document.getElementById('selected-btn').innerText = n.toUpperCase(); document.getElementById('btn-input').value = ""; }
};

document.getElementById('update-wait-btn').onclick = () => {
    let time = document.getElementById('wait-input').value;
    if(time && !isNaN(time)) {
        document.getElementById('wait-val').innerText = time;
        document.getElementById('wait-input').value = "";
    }
};

document.getElementById('add-btn').onclick = () => {
    playTickSound();
    let v = parseInt(document.getElementById('add-input').value) || 0;
    day += v; week += v; total += v; updateUI();
    document.getElementById('add-input').value = "";
};

document.getElementById('delete-btn').onclick = () => {
    playTickSound();
    let v = parseInt(document.getElementById('delete-input').value) || 0;
    day = Math.max(0, day - v); week = Math.max(0, week - v); total = Math.max(0, total - v); updateUI();
    document.getElementById('delete-input').value = "";
};

document.getElementById('reset-all').onclick = () => { playTickSound(); day = 0; week = 0; total = 0; updateUI(); };
document.getElementById('reset-day').onclick = () => { playTickSound(); day = 0; updateUI(); };
document.getElementById('reset-week').onclick = () => { playTickSound(); week = 0; updateUI(); };

updateUI();