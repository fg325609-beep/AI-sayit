import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BOT_TOKEN = "YOUR_BOT_TOKEN"  # BotFather dan oling
CHAT_ID = "Farhod00111"  # Yoki raqamli ID: 123456789

@app.route('/send-message', methods=['POST'])
def send():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    msg = data.get('message')
    
    text = f"📩 Yangi xabar:\n👤 {name}\n📧 {email}\n💬 {msg}"
    
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML"}
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": response.text}), 500

if __name__ == '__main__':
    app.run(port=5000)