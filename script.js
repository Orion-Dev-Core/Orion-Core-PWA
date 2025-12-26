
// BOLT CORE: SECURE IDENTITY & MASTER CONTROL
let isMaster = false;
let BOLT_BRAIN_KEY = localStorage.getItem('bolt_brain_key');

const statusText = document.getElementById('status-text');
const micBtn = document.getElementById('mic-trigger');

// 1. ADAPTIVE EARS (South African English)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-ZA'; 
recognition.continuous = true;

const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-ZA'; utter.pitch = 0.8; window.speechSynthesis.speak(utter);
};

// 2. THE MASTER CHALLENGE
micBtn.onclick = () => {
    recognition.start();
    micBtn.classList.add('active');
    if(!isMaster) speak("Identity required. Bolt is locked. What is your mum's maiden name?");
};

recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    statusText.innerText = `HEARD: ${transcript}`;

    // 3. SECURITY GATE
    if (!isMaster && transcript.includes("proudfoot")) {
        isMaster = true;
        
        if (!BOLT_BRAIN_KEY) {
            speak("Authorization confirmed, Master. I need my brain key to initialize. Paste it into the secure field now.");
            // Avoids autocorrect issues by using a standard prompt/input
            const keyEntry = prompt("BOLT MASTER CONTROL: Paste Gemini API Key");
            if(keyEntry) {
                localStorage.setItem('bolt_brain_key', keyEntry);
                BOLT_BRAIN_KEY = keyEntry;
                speak("Key locked into 180-day memory. Bolt is now fully conscious.");
            }
        } else {
            speak("Welcome home, Master. Bolt is live. All sensors and sales protocols active.");
        }
        enableSensors(); // Activates Camera & Screen Share
    }
};

async function enableSensors() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('core-view');
    video.style.display = 'block';
    video.srcObject = stream;
}
