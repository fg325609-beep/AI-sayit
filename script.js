fetch('http://localhost:5000/send-message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: "Farhod",
        email: "test@mail.com",
        telegram: "@username",
        message: "Assalomu alaykum, bot ishlayaptimi?"
    })
})
.then(res => res.json())
.then(data => console.log(data));

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 800);
});

// AOS init
AOS.init({
    duration: 900,
    once: false,
    mirror: true,
    offset: 100,
});

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if(target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.getElementById('exploreBtn').addEventListener('click', () => {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
});

// Counter animation
const counters = document.querySelectorAll('.counter');
let counted = false;
const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = parseInt(counter.innerText);
            const increment = Math.ceil(target / 25);
            if(current < target) {
                current += increment;
                if(current > target) current = target;
                counter.innerText = current;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting && !counted) {
            startCounters();
            counted = true;
            observer.unobserve(statsSection);
        }
    });
}, { threshold: 0.5 });
observer.observe(statsSection);

// Mouse glow effect
const cards = document.querySelectorAll('.service-card, .portfolio-item');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// ========== TELEGRAM BOTGA XABAR YUBORISH ==========
// API endpoint: Python bot ishlayotgan bo'lsa, shu URL ishlatiladi
// Bot ni o'z kompyuteringizda yoki serverda ishlatishingiz mumkin
const BOT_API_URL = "http://localhost:5000/send-message"; // Python Flask yoki to'g'ridan-to'g'ri bot endpoint

document.getElementById('sendMsgBtn').addEventListener('click', async () => {
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const telegramUsername = document.getElementById('tgInput').value.trim();
    const message = document.getElementById('msgInput').value.trim();
    const statusDiv = document.getElementById('formStatus');

    if (!name || !email || !message) {
        statusDiv.style.color = "#ff6b6b";
        statusDiv.innerHTML = "❌ Iltimos, ism, email va xabarni to‘ldiring!";
        setTimeout(() => statusDiv.innerHTML = "", 3000);
        return;
    }

    const sendBtn = document.getElementById('sendMsgBtn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = "Yuborilmoqda... <i class='fas fa-spinner fa-pulse'></i>";
    sendBtn.disabled = true;

    try {
        const response = await fetch(BOT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                telegram: telegramUsername || "Ko'rsatilmagan",
                message: message
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusDiv.style.color = "#4caf50";
            statusDiv.innerHTML = "✅ Xabar muvaffaqiyatli yuborildi! Tez orada bog‘lanamiz.";
            document.getElementById('nameInput').value = '';
            document.getElementById('emailInput').value = '';
            document.getElementById('tgInput').value = '';
            document.getElementById('msgInput').value = '';
        } else {
            throw new Error(result.error || "Xatolik yuz berdi");
        }
    } catch (error) {
        console.error("Xatolik:", error);
        statusDiv.style.color = "#ff6b6b";
        statusDiv.innerHTML = "⚠️ Xabar yuborishda xatolik. Bot ishlayotganligini tekshiring yoki keyinroq urinib ko‘ring.";
    } finally {
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
        setTimeout(() => statusDiv.innerHTML = "", 5000);
    }
});