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
    utter.lang = 'en-ZA'; 
    utter.pitch = 0.8; // High-velocity closer tone
    window.speechSynthesis.speak(utter);
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
            speak("Authorization confirmed. Paste the Brain Key into the secure field now.");
            
            // Create a secure, non-autocorrecting input
            const keyInput = document.createElement('input');
            keyInput.setAttribute('type', 'text');
            keyInput.setAttribute('autocorrect', 'off');
            keyInput.setAttribute('autocapitalize', 'none');
            keyInput.setAttribute('spellcheck', 'false');
            keyInput.style.cssText = "position:fixed; top:50%; left:5%; width:90%; padding:15px; background:#1a1a1a; color:#00f2ff; border:2px solid #00f2ff; z-index:9999;";
            keyInput.placeholder = "PASTE GEMINI KEY HERE";
            
            document.body.appendChild(keyInput);
            keyInput.focus();

            keyInput.oninput = () => {
                if(keyInput.value.length > 20) { // Typical API key length
                    localStorage.setItem('bolt_brain_key', keyInput.value);
                    BOLT_BRAIN_KEY = keyInput.value;
                    speak("Key locked into 180-day memory. Bolt is now fully conscious.");
                    keyInput.remove();
                    enableSensors(); //
                }
            };
        } else {
            speak("Welcome home, Master. Bolt is live. Sensors and sales protocols active.");
            enableSensors();
        }
    }
};

async function enableSensors() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('core-view') || document.createElement('video');
    video.id = 'core-view';
    video.style.cssText = "width:100%; border-radius:15px; margin-top:20px; border:1px solid #00f2ff;";
    video.autoplay = true;
    video.playsinline = true;
    document.querySelector('.main-stage').appendChild(video);
    video.srcObject = stream;
}

