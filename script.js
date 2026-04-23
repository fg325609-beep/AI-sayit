// Barcha funksiyalarni bitta joyga jamlaymiz
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. AOS Init
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 900, once: false });
    }

    // 2. Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // 3. Telegramga xabar yuborish
    const sendBtn = document.getElementById('sendMsgBtn');
    const statusDiv = document.getElementById('formStatus');

    if (sendBtn) {
        sendBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // Sahifa yangilanib ketishini to'xtatish

            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();
            const telegram = document.getElementById('tgInput').value.trim();
            const message = document.getElementById('msgInput').value.trim();

            if (!name || !email || !message) {
                showStatus("❌ Iltimos, barcha maydonlarni to'ldiring!", "red");
                return;
            }

            // Tugmani bloklash
            sendBtn.disabled = true;
            sendBtn.innerHTML = "Yuborilmoqda... <i class='fas fa-spinner fa-pulse'></i>";

            try {
                const response = await fetch('http://localhost:5000/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, telegram, message })
                });

                const result = await response.json();

                if (result.success) {
                    showStatus("✅ Xabar muvaffaqiyatli yuborildi!", "#4caf50");
                    // Formani tozalash
                    document.getElementById('nameInput').value = "";
                    document.getElementById('emailInput').value = "";
                    document.getElementById('tgInput').value = "";
                    document.getElementById('msgInput').value = "";
                } else {
                    showStatus("❌ Xatolik yuz berdi!", "red");
                }
            } catch (error) {
                showStatus("⚠️ Server bilan aloqa yo'q! (bot.py ishlayotganini tekshiring)", "red");
            } finally {
                sendBtn.disabled = false;
                sendBtn.innerHTML = "Xabar yuborish";
            }
        });
    }

    function showStatus(text, color) {
        if (statusDiv) {
            statusDiv.innerHTML = text;
            statusDiv.style.color = color;
            setTimeout(() => { statusDiv.innerHTML = ""; }, 5000);
        }
    }
});