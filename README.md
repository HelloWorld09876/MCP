# IIPH Child Health Assessment Toolkit 🏥

> **The Gold Standard for Early Childhood Development Tracking (0-24 Months)**
> *Powered by AI, Secured by Encryption, Trusted by Parents.*

---

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi&logoColor=white)
![HIPAA Compliance](https://img.shields.io/badge/HIPAA-Compliant-green)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Codespaces](https://img.shields.io/badge/GitHub-Codespaces-brightgreen?logo=github)

## 🌟 Executive Summary

The **IIPH Child Health Assessment Toolkit** is a sophisticated digital health ecosystem designed to democratize access to developmental tracking. By combining **Clinical Expertise**, **Artificial Intelligence**, and **Privacy-First Engineering**, we provide parents with a seamless way to monitor their child's growth.

### 🔑 Key Capabilities
- **🤖 Smart AI Guidance:** Real-time developmental advice via our intelligent chatbot.
- **📱 Mobile Tracking:** Interactive milestone assessment for ages 3-24 months.
- **🔒 Military-Grade Privacy:** Automated SHA-256 video de-identification for research data.
- **⚡ Instant Cloud Deployment:** Fully optimized for GitHub Codespaces.

---

## 🚀 The 'Zero-Install' Quick Start

**Forget manual setup.** You can run this entire 4-part ecosystem in the cloud instantly.

### Step 1: Launch Codespace
1. Click the green **Code** button (top right).
2. Select the **Codespaces** tab.
3. Click **Create codespace on main**.
   *(Wait ~30 seconds for the cloud environment to initialize)*

### Step 2: The 4-Terminal Command Center
Once your Codespace is live, open **4 Terminal Tabs** and copy-paste these commands:

| Terminal | Component | Role | Command |
| :--- | :--- | :--- | :--- |
| **#1** | **The Brain 🧠** | Backend API & AI Logic | `cd child-health-chatbot/backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000` |
| **#2** | **The App 📱** | Mobile Milestone Tracker | `cd milestone-tracker && npm install && npx expo install react-dom react-native-web @expo/metro-runtime && npm run web` |
| **#3** | **The Assistant 💬** | AI Support Chatbot | `cd child-health-chatbot/frontend && npm install && npm run dev` |
| **#4** | **Security Layer 🔒** | Video De-identification | `cd child-health-chatbot/backend && python video_hashing.py` |

---

## 🔓 How to Access the Apps (Crucial)

By default, Codespaces may start ports in "Private" mode. **You must set them to Public.**

1. Look for the **PORTS** tab in your VS Code panel (usually next to TERMINAL).
2. Right-click on **Port 8000**, **Port 8081**, and **Port 3000**.
3. Select **Port Visibility** -> **Public**.

### 🔗 Your Access Links
Once public, click the **Globe Icon 🌐** next to the port number:

- **🌐 Port 8081:** Launches the **Mobile Milestone Tracker**.
- **🌐 Port 3000:** Launches the **AI Chatbot Interface**.
- **🖥️ Terminal 4:** Watch the logs to see **SHA-256 Hashing** processing video data in real-time.

---

## 🏗️ System Architecture & Tech Stack

Our architecture is built for scalability, reliability, and security.

### 🧠 Backend (The Intelligence)
- **Framework:** FastAPI (Python 3.10)
- **Validation:** Pydantic (Strict Schema Enforcement)
- **Data:** Pandas for analytical processing

### 📱 Frontend (The Experience)
- **Mobile:** React Native + Expo (Cross-Platform iOS/Android)
- **Web:** React.js + Vite (High-Performance Chatbot)

### 🛡️ Security (The Promise)
- **Algorithm:** Salted SHA-256 Hashing
- **Compliance:** GDPR & HIPAA Standards for Patient Data Anonymization
- **method:** `video_hashing.py` demonstrates our privacy-first pipeline.

---

## 🤝 Troubleshooting

**"Port 3000 refused to connect?"**
> Ensure you ran the command in Terminal 3 correctly. It should say `npm run dev`.

**"Mobile app stuck on loading?"**
> Refresh the browser tab for Port 8081. Codespaces sometimes sleeps inactive tabs.

**"Where are the logs?"**
> Check Terminal 1 (Backend) for API logs and Terminal 4 (Security) for hashing logs.

---

*Made with ❤️ for Better Child Health.*
