// ========== KONFIGURATSIYA ==========
const BOT_API_URL = "http://localhost:5000/send-message";

// 1. Preloader (Yaxshilandi: sahifa to'liq yuklangach o'chadi)
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 800);
    }
});

// 2. AOS init
AOS.init({
    duration: 900,
    once: false,
    mirror: true,
    offset: 100,
});

// 3. Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 4. Smooth scroll
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

const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// 5. Counter animation
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = parseInt(counter.innerText) || 0;
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
if (statsSection) {
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
}

// 6. Mouse glow effect
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

// 7. ========== TELEGRAM BOTGA XABAR YUBORISH (To'g'rilandi) ==========
const sendMsgBtn = document.getElementById('sendMsgBtn');

if (sendMsgBtn) {
    sendMsgBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('nameInput');
        const emailInput = document.getElementById('emailInput');
        const tgInput = document.getElementById('tgInput');
        const msgInput = document.getElementById('msgInput');
        const statusDiv = document.getElementById('formStatus');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const telegramUsername = tgInput.value.trim();
        const message = msgInput.value.trim();

        // Validatsiya
        if (!name || !email || !message) {
            showStatus(statusDiv, "❌ Ism, email va xabarni to‘ldiring!", "#ff6b6b");
            return;
        }

        // Email formatini tekshirish (Oddiy)
        if (!email.includes('@')) {
            showStatus(statusDiv, "❌ Email xato kiritildi!", "#ff6b6b");
            return;
        }

        const originalText = sendMsgBtn.innerHTML;
        sendMsgBtn.innerHTML = "Yuborilmoqda... <i class='fas fa-spinner fa-pulse'></i>";
        sendMsgBtn.disabled = true;

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
                showStatus(statusDiv, "✅ Xabar muvaffaqiyatli yuborildi!", "#4caf50");
                // Formalarni tozalash
                nameInput.value = '';
                emailInput.value = '';
                tgInput.value = '';
                msgInput.value = '';
            } else {
                throw new Error(result.error || "Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            showStatus(statusDiv, "⚠️ Xato! Bot ishlayotganini tekshiring.", "#ff6b6b");
        } finally {
            sendMsgBtn.innerHTML = originalText;
            sendMsgBtn.disabled = false;
        }
    });
}

// Status xabarlarini ko'rsatish uchun yordamchi funksiya
function showStatus(element, text, color) {
    if (!element) return;
    element.style.color = color;
    element.innerHTML = text;
    setTimeout(() => {
        element.innerHTML = "";
    }, 5000);
}