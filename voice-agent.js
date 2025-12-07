/*
    Vijay Electronics AI Voice Assistant
    - Uses Web Speech API (SpeechRecognition & SpeechSynthesis)
    - Supports Keyword matching for immediate answers (CCTV, Price, Location)
    - Fallback: "Call 8090090051" for complex queries.
*/

class VijayAI {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.isListening = false;
        this.voices = [];
        this.currentLang = localStorage.getItem('language') || 'en'; // Default English

        // DOM Elements
        this.modal = document.getElementById('aiModal');
        this.chatBody = document.getElementById('aiChatBody');
        this.input = document.getElementById('aiInput');
        this.micBtn = document.getElementById('voiceAiFloat');
        this.sendBtn = document.getElementById('aiSendBtn');
        this.closeBtn = document.getElementById('closeAiModal');
        this.indicator = document.getElementById('typingIndicator');

        // Setup
        this.setupRecognition();
        this.setupEventListeners();

        // Load Voices
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        if (lang === 'hi') {
            this.recognition.lang = 'hi-IN';
        } else {
            this.recognition.lang = 'en-IN';
        }
        this.loadVoices(); // Re-select best voice for language
    }

    loadVoices() {
        this.voices = this.synth.getVoices();

        if (this.currentLang === 'hi') {
            // Try to find a Hindi Voice
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.includes('hi') || voice.lang.includes('Hindi')
            );
        } else {
            // Indian English
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.includes('IN') || voice.lang.includes('India') || voice.name.includes('India')
            );
        }

        // Fallback
        if (!this.preferredVoice) this.preferredVoice = this.voices[0];
    }

    setupRecognition() {
        this.recognition.lang = this.currentLang === 'hi' ? 'hi-IN' : 'en-IN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.micBtn.classList.add('listening');
            this.micBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.micBtn.classList.remove('listening');
            this.micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleUserFullInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.isListening = false;
            this.micBtn.classList.remove('listening');
        };
    }

    setupEventListeners() {
        // Toggle Modal
        this.micBtn.addEventListener('click', () => {
            if (this.modal.style.display !== 'flex') {
                this.openModal();
                this.startListening();
            } else {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            }
        });

        this.closeBtn.addEventListener('click', () => this.closeModal());

        this.sendBtn.addEventListener('click', () => {
            const text = this.input.value.trim();
            if (text) this.handleUserFullInput(text);
        });

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = this.input.value.trim();
                if (text) this.handleUserFullInput(text);
            }
        });
    }

    openModal() {
        this.modal.style.display = 'flex';
        if (this.chatBody.children.length === 0) {
            const welcomeMsg = this.currentLang === 'hi'
                ? "🙏 नमस्ते! विजय इलेक्ट्रॉनिक्स उन्नाव में आपका स्वागत है। मैं आपकी क्या मदद कर सकता हूँ? (CCTV, TV, Laptop)"
                : "🙏 Namaste! Welcome to Vijay Electronics Unnao. Main aapki kya help kar sakta hoon? (CCTV, TV, Laptop)";

            this.addBotMessage(welcomeMsg);
            this.speak(welcomeMsg);
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.stopListening();
        this.synth.cancel();
    }

    startListening() {
        try {
            this.recognition.start();
        } catch (e) {
            console.log('Recognition already started');
        }
    }

    stopListening() {
        this.recognition.stop();
    }

    handleUserFullInput(text) {
        this.addUserMessage(text);
        this.input.value = '';
        this.indicator.style.display = 'block';

        setTimeout(() => {
            const response = this.getAIResponse(text.toLowerCase());
            this.indicator.style.display = 'none';
            this.addBotMessage(response);
            this.speak(response);
        }, 800);
    }

    addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user';
        div.textContent = text;
        this.chatBody.appendChild(div);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot';
        if (text.includes('http')) {
            div.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:var(--primary-color)">Link</a>');
        } else {
            div.textContent = text;
        }
        this.chatBody.appendChild(div);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }
        utterance.rate = 1;
        utterance.pitch = 1;
        this.synth.speak(utterance);
    }

    // --- AI LOGIC (HINDI + HINGLISH) ---
    getAIResponse(input) {
        const isHindi = this.currentLang === 'hi';

        // 1. Pricing
        if (input.includes('price') || input.includes('rate') || input.includes('cost') || input.includes('पैसे') || input.includes('मूल्य') || input.includes('kitne ka')) {
            if (isHindi) return "CCTV कैमरे की कीमत ₹1200 से ₹1800 तक है। इंस्टॉलेशन शुल्क ₹200-350 है। सही कीमत तकनीशियन के देखने के बाद तय होगी।";
            return "Sir, CCTV ki price range: 2MP Camera ₹1200–₹1800, DVR ₹1800–₹2500. Installation ₹200–₹350 per camera. Final price technician check karne ke baad confirm hoti hai.";
        }

        // 2. Location
        if (input.includes('location') || input.includes('address') || input.includes('kahan') || input.includes('shop') || input.includes('जगह') || input.includes('पता')) {
            if (isHindi) return "हमारी दुकान विजय इलेक्ट्रॉनिक्स, पुरानी बाजार, उन्नाव में है। आप गूगल मैप पर भी देख सकते हैं।";
            return "Hamari shop Vijay Electronics, Purani Bazar, Unnao mein hai. Google Map par 'Vijay Electronics Unnao' search karein. Home service bhi available hai.";
        }

        // 3. CCTV General
        if (input.includes('cctv') || input.includes('camera') || input.includes('कैमरा')) {
            if (isHindi) return "हमारे पास डोम, बुलेट, और वाईफाई कैमरे उपलब्ध हैं। हम मोबाइल व्यू सेटअप भी करके देते हैं।";
            return "Hamaare paas Dome, Bullet, PTZ, Wireless Kit sab available hai. Installation + Mobile View support milta hai. Aap requirement batayein?";
        }

        // General Default
        if (isHindi) return "क्षमा करें, मैं समझा नहीं। आप CCTV, TV रिपेयर, या लैपटॉप के बारे में पूछ सकते हैं। या 8090090051 पर कॉल करें।";
        return "Sorry, main samjha nahi. Aap CCTV, TV Repair, ya Laptop ke baare mein pooch sakte hain. Ya call karein 8090090051.";
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.vijayAI = new VijayAI();
});
