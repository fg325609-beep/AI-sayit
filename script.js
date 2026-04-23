// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 800);
    }
});

// AOS Initialization
AOS.init({
    duration: 900,
    once: false,
    mirror: true,
    offset: 100,
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Smooth Scroll for anchor links
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

// Explore Button
const exploreBtn = document.getElementById('exploreBtn');
if(exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        const servicesSec = document.getElementById('services');
        if(servicesSec) {
            servicesSec.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Portfolio button (outline)
const outlineBtn = document.querySelector('.btn-outline');
if(outlineBtn) {
    outlineBtn.addEventListener('click', () => {
        const portfolioSec = document.getElementById('portfolio');
        if(portfolioSec) {
            portfolioSec.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Counter Animation for Stats
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = parseInt(counter.innerText);
            const increment = Math.ceil(target / 30);
            if(current < target) {
                current += increment;
                if(current > target) current = target;
                counter.innerText = current;
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer for stats
const statsSection = document.querySelector('.stats');
if(statsSection) {
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

// Mouse glow effect for cards
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

// ============================================
// TELEGRAM BOT O'RNIGA - TO'G'RIDAN-TO'G'RI TELEGRAM LINK
// (Botsiz yechim - foydalanuvchi o'zi yozadi)
// ============================================

const sendBtn = document.getElementById('sendMsgBtn');
const formStatus = document.getElementById('formStatus');

if(sendBtn) {
    sendBtn.addEventListener('click', () => {
        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const telegramUsername = document.getElementById('tgInput').value.trim();
        const message = document.getElementById('msgInput').value.trim();

        // Validation
        if(!name || !email || !message) {
            if(formStatus) {
                formStatus.style.color = "#ff6b6b";
                formStatus.innerHTML = "❌ Iltimos, ism, email va xabarni to'ldiring!";
                setTimeout(() => formStatus.innerHTML = "", 3000);
            }
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            if(formStatus) {
                formStatus.style.color = "#ff6b6b";
                formStatus.innerHTML = "❌ Noto'g'ri email manzil!";
                setTimeout(() => formStatus.innerHTML = "", 3000);
            }
            return;
        }

        // Create message text for Telegram
        let tgMessage = `📩 *Yangi xabar keldi!*%0A%0A`;
        tgMessage += `👤 *Ism:* ${encodeURIComponent(name)}%0A`;
        tgMessage += `📧 *Email:* ${encodeURIComponent(email)}%0A`;
        
        if(telegramUsername) {
            tgMessage += `📱 *Telegram:* @${encodeURIComponent(telegramUsername.replace('@', ''))}%0A`;
        }
        
        tgMessage += `💬 *Xabar:* ${encodeURIComponent(message)}%0A%0A`;
        tgMessage += `🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`;

        // Telegram link to Farhod00111
        // Bu yerda foydalanuvchi o'zining Telegram akkauntida ochadi va yuboradi
        const telegramLink = `https://t.me/Farhod00111?text=${tgMessage}`;
        
        // Show success message and open Telegram
        if(formStatus) {
            formStatus.style.color = "#4caf50";
            formStatus.innerHTML = "✅ Telegram ochilmoqda... Iltimos, xabarni yuboring!";
        }
        
        // Change button text temporarily
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = "Telegram ochilmoqda... <i class='fab fa-telegram'></i>";
        sendBtn.disabled = true;
        
        // Open Telegram link in new tab
        window.open(telegramLink, '_blank');
        
        // Clear form fields
        setTimeout(() => {
            document.getElementById('nameInput').value = '';
            document.getElementById('emailInput').value = '';
            document.getElementById('tgInput').value = '';
            document.getElementById('msgInput').value = '';
            
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
            
            if(formStatus) {
                formStatus.innerHTML = "✅ Xabar matni tayyorlandi! Telegramda yuboring.";
                setTimeout(() => formStatus.innerHTML = "", 5000);
            }
        }, 2000);
    });
}

// Add some animation on scroll for portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Refresh AOS on window resize
window.addEventListener('resize', () => {
    AOS.refresh();
});

// Console log to confirm script loaded
console.log('Premium Studio sayti ishga tushdi! ✨');