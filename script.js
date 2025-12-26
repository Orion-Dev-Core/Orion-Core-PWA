// ORION CORE: VOICE & DATA INITIALIZATION
const statusText = document.getElementById('status-text');
const micBtn = document.getElementById('mic-trigger');

// 1. THE EARS: Listening to your accent (South African English)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-ZA'; 
recognition.interimResults = false;

// 2. THE VOICE: Neural-style delivery
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-ZA';
    utterance.pitch = 0.8; // Deep, authoritative tone
    utterance.rate = 1.0; 
    window.speechSynthesis.speak(utterance);
};

// 3. THE DATA: Live Pulse (ZAR & KZN)
async function updatePulse() {
    try {
        const zarRes = await fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json());
        const weatherRes = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Durban&units=metric&appid=4772093554e2f1e29f3453880629a997').then(res => res.json());
        
        document.getElementById('zar-display').innerText = `ZAR: R${zarRes.rates.ZAR.toFixed(2)}`;
        document.getElementById('weather-display').innerText = `KZN: ${Math.round(weatherRes.main.temp)}°C`;
    } catch (e) { console.log("Pulse offline"); }
}

// 4. THE INTERACTION: Smart & Witty logic
micBtn.onclick = () => {
    recognition.start();
    micBtn.classList.add('active');
    statusText.innerText = "Orion is listening...";
};

recognition.onresult = (event) => {
    micBtn.classList.remove('active');
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusText.innerText = `You: "${transcript}"`;
    
    // Orion's Witty Learning Response
    if(transcript.includes("zar") || transcript.includes("rand")) {
        const msg = "The Rand is volatile, but my ROI is constant. Check the header.";
        speak(msg);
    } else {
        const response = "I hear you. My Core is learning your frequency. Let's move to the next step.";
        speak(response);
    }
};

updatePulse();
