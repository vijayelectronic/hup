const translations = {
    "en": {
        "nav_home": "Home",
        "nav_products": "Products",
        "nav_services": "Services",
        "nav_contact": "Contact",
        "hero_title_1": "Secure Your World with",
        "hero_title_2": "Vijay Electronics",
        "hero_subtitle": "Unnao's #1 CCTV, LED TV & Laptop Repair Center.",
        "btn_book": "Book Repair",
        "btn_view_products": "View Products",
        "services_title": "Our Premium Services",
        "service_cctv_title": "CCTV Installation",
        "service_cctv_desc": "Dome, Bullet, PTZ & IP Cameras. Mobile View Config. CP Plus, Hikvision & More.",
        "service_tv_title": "LED TV Repair",
        "service_tv_desc": "Panel replacement, Backlight issues, Sound problems. Expert diagnosis.",
        "service_laptop_title": "Laptop & PC Repair",
        "service_laptop_desc": "Screen replacement, Windows installation, Speed upgrade (SSD/RAM).",
        "service_amc_title": "AMC Services",
        "service_amc_desc": "Annual Maintenance Contracts for schools, offices, and homes.",
        "learn_more": "Learn More →",
        "visit_shop": "Visit Our Shop",
        "shop_address": "Purani Bazar, Unnao | Open: 9:00 AM - 9:00 PM",
        "contact_title": "Contact Us",
        "get_quote": "Get a Quote / Book Service",
        "fill_form": "Fill the form or WhatsApp us directly.",
        "form_name": "Your Name",
        "form_phone": "Mobile Number",
        "form_select": "Select Service",
        "form_msg": "Describe your issue...",
        "btn_send": "Send Request",
        "call_us": "Call Us",
        "email_us": "Email",
        "whatsapp_chat": "WhatsApp Chat",
        "instant_support": "Instant Support",
        "chat_now": "Chat Now →",
        "footer_rights": "© 2024 Vijay Electronics Unnao. All rights reserved.",
        "designed_ai": "Designed with AI",
        "ai_modal_title": "Vijay AI Assistant",
        "ai_placeholder": "Type or Speak..."
    },
    "hi": {
        "nav_home": "होम",
        "nav_products": "प्रोडक्ट्स",
        "nav_services": "सेवाएं",
        "nav_contact": "संपर्क करें",
        "hero_title_1": "अपनी दुनिया को सुरक्षित करें",
        "hero_title_2": "विजय इलेक्ट्रॉनिक्स",
        "hero_subtitle": "उन्नाव का #1 CCTV, LED TV और लैपटॉप रिपेयर सेंटर।",
        "btn_book": "रिपेयर बुक करें",
        "btn_view_products": "प्रोडक्ट्स देखें",
        "services_title": "हमारी सेवाएँ",
        "service_cctv_title": "CCTV इंस्टॉलेशन",
        "service_cctv_desc": "डोम, बुलेट, PTZ और IP कैमरे। मोबाइल व्यू सेटिंग। CP Plus, Hikvision आदि।",
        "service_tv_title": "LED TV रिपेयर",
        "service_tv_desc": "पैनल बदलना, बैकलाइट समस्या, साउंड प्रॉब्लम। एक्सपर्ट रिपेयर।",
        "service_laptop_title": "लैपटॉप और पीसी रिपेयर",
        "service_laptop_desc": "स्क्रीन बदलना, विंडोज इंस्टॉलेशन, स्पीड बढ़ाना (SSD/RAM)।",
        "service_amc_title": "AMC सेवाएँ",
        "service_amc_desc": "स्कूलों, कार्यालयों और घरों के लिए वार्षिक रखरखाव अनुबंध।",
        "learn_more": "और जानें →",
        "visit_shop": "हमारी दुकान पर आएं",
        "shop_address": "पुरानी बाजार, उन्नाव | खुला है: सुबह 9:00 - रात 9:00",
        "contact_title": "संपर्क करें",
        "get_quote": "कोटेशन प्राप्त करें / बुक करें",
        "fill_form": "फॉर्म भरें या सीधे व्हाट्सएप करें।",
        "form_name": "आपका नाम",
        "form_phone": "मोबाइल नंबर",
        "form_select": "सेवा चुनें",
        "form_msg": "अपनी समस्या बताएं...",
        "btn_send": "अनुरोध भेजें",
        "call_us": "कॉल करें",
        "email_us": "ईमेल",
        "whatsapp_chat": "व्हाट्सएप चैट",
        "instant_support": "तुरंत सहायता",
        "chat_now": "चैट करें →",
        "footer_rights": "© 2024 विजय इलेक्ट्रॉनिक्स उन्नाव। सर्वाधिकार सुरक्षित।",
        "designed_ai": "AI द्वारा डिज़ाइन किया गया",
        "ai_modal_title": "विजय AI असिस्टेंट",
        "ai_placeholder": "लिखें या बोलें..."
    }
};

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Save preference
    localStorage.setItem('language', lang);

    // Switch Font if Hindi (Optional, but looks better)
    if (lang === 'hi') {
        document.body.style.fontFamily = "'Noto Sans Devanagari', 'Inter', sans-serif";
    } else {
        document.body.style.fontFamily = "'Outfit', 'Inter', sans-serif";
    }

    // Update Button State
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) btn.classList.add('active');
    });

    // Update Voice Agent Language automatically
    if (window.vijayAI) {
        window.vijayAI.setLanguage(lang);
    }
}

// Load Google Font for Hindi dynamically
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);
