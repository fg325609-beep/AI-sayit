import asyncio
import json
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

# ========== KONFIGURATSIYA ==========
TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"  # <--- O'z tokeningizni yozing
TARGET_CHAT_ID = "Farhod00111"  # Username yoki Chat ID (masalan: "@Farhod00111" yoki raqam)

# Flask server (saytdan POST qabul qilish uchun)
app_flask = Flask(__name__)
CORS(app_flask)  # CORS ruxsat

# Telegram bot obyekti (global)
telegram_app = None

# ========== FLASK ENDPOINT (saytdan xabar qabul qiladi) ==========
@app_flask.route('/send-message', methods=['POST'])
def send_message():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        telegram_username = data.get('telegram')
        msg_text = data.get('message')

        if not name or not email or not msg_text:
            return jsonify({"success": False, "error": "Ism, email va xabar majburiy"}), 400

        # Telegramga yuboriladigan matn
        tg_message = f"""
📩 **Yangi xabar keldi!**

👤 **Ism:** {name}
📧 **Email:** {email}
📱 **Telegram:** {telegram_username}
💬 **Xabar:** {msg_text}
        """

        # Asinxron tarzda Telegramga yuborish
        asyncio.run_coroutine_threadsafe(send_telegram_message(tg_message), loop)

        return jsonify({"success": True, "message": "Xabar Telegramga yuborildi"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

async def send_telegram_message(text):
    """Telegram bot orqali xabar yuborish"""
    try:
        bot = telegram_app.bot
        await bot.send_message(chat_id=TARGET_CHAT_ID, text=text, parse_mode="Markdown")
        print("✅ Xabar Telegramga yuborildi!")
    except Exception as e:
        print(f"❌ Xatolik: {e}")

# ========== TELEGRAM BOT KOMANDALARI ==========
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🤖 Assalomu alaykum! Men Premium Studio botiman.\n"
        "Sayt orqali yuborilgan xabarlar sizga yetkaziladi."
    )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Oddiy echo funksiya
    await update.message.reply_text("Men faqat saytdan xabarlarni qabul qilaman.")

def run_flask():
    """Flask serverni alohida threadda ishga tushirish"""
    app_flask.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)

if __name__ == "__main__":
    # Telegram botni ishga tushirish
    telegram_app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    telegram_app.add_handler(CommandHandler("start", start))
    telegram_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    # Asinxron event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Flask serverni alohida threadda ishlatish
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True
    flask_thread.start()

    print("🤖 Bot ishga tushdi va Flask server http://localhost:5000 da ishlamoqda...")
    # Telegram botni polling bilan ishlatish
    telegram_app.run_polling(allowed_updates=Update.ALL_TYPES)