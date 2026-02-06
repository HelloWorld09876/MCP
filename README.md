# 🚀 IIPH Child Health Toolkit: Ultimate Run Guide

This guide covers the local deployment of all components, including the latest **AI Video Analysis** and **Bilingual MCP Card UI** features.

---

## 🛠️ Step 0: Global Setup
Ensure you have these installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (LTS)](https://nodejs.org/)
- **Expo Go** App (on your Smartphone)

---

## 🐍 Phase 1: Backend & Core Logic
The FastAPI server is the "brain" for both the web chatbot and the mobile app.

### 1. Setup Environment
```bash
cd c:\Users\adity\random
python -m venv venv
.\venv\Scripts\activate
# Install all required packages
pip install pandas python-dotenv fastapi uvicorn python-multipart
```

### 2. Configure Security (.env)
Make sure a `.env` file exists in `c:\Users\adity\random` with:
```env
VIDEO_HASH_SALT=your_secret_salt_here
```

### 3. Launch Backend
```bash
cd c:\Users\adity\random\child-health-chatbot\backend
uvicorn main:app --reload --port 8000
```
*API docs available at: `http://localhost:8000/docs`*

---

## 📱 Phase 2: Mobile Milestone Tracker (React Native)
This is the modern MCP Card interface you just updated.

### 1. Configure for your Phone
Open `c:\Users\adity\random\milestone-tracker\App.js` and verify line 24:
```javascript
const API_BASE_URL = 'http://10.30.66.193:8000'; // Success! You've already set your laptop's IP.
```

### 2. Install & Start
```bash
cd c:\Users\adity\random\milestone-tracker
npm install
npm run dev
```

### 3. Open on Device
1. Connect your phone to the **same Wi-Fi** as your laptop.
2. Scan the **QR Code** using the **Expo Go** app.
3. Test the **Bilingual Toggle** and **Evaluate Progress** button!

---

## 🤖 Phase 3: Web Chatbot (React)
The web-based assistant for parents.

### 1. Install & Start
```bash
cd c:\Users\adity\random\child-health-chatbot\frontend
npm install
npm start
```
*URL: `http://localhost:3000`*

---

## 📹 Phase 4: Video Dataset Management (De-identification)
Use this for the research/internship side of the project.

### 1. De-identify Videos
```bash
# Ensure venv is active
cd c:\Users\adity\random
python video_dataset_manager.py
```

---

## 💡 Pro-Tips for Success
- **Firewall**: If the mobile app can't talk to the backend, ensure Windows Firewall allows port **8000**.
- **IP Address**: If you change Wi-Fi networks, your IP (`10.30.66.193`) might change. Check `ipconfig` and update `App.js` if needed.
- **Dependencies**: Always run `npm install` after a major UI update.

---
**Developed for IIPH Hyderabad Public Health Project** 🏥
