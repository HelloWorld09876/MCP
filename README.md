# IIPH Child Health Assessment Toolkit 🏥

> An integrated digital health ecosystem for early childhood development tracking (0-24 months) and clinical data privacy.

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi&logoColor=white)
![HIPAA Compliance](https://img.shields.io/badge/HIPAA-Compliant-green)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Quick Start: Run on GitHub Codespaces (The Priority Section)

This project is optimized for **GitHub Codespaces**, providing a zero-installation development environment.

### How to Launch

1. Click the **Code** button at the top right of this repository.
2. Select the **Codespaces** tab.
3. Click **Create codespace on main**.

### The 4-Terminal Setup Strategy

Once your Codespace is ready, open four separate terminals to launch the entire ecosystem.

#### Terminal 1 (The Brain - Backend API) 🧠
Powers the AI logic and data validation engine.

```bash
cd child-health-chatbot/backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

#### Terminal 2 (The Parent App - Mobile Tracker) 📱
Launches the mobile application for developmental tracking.

```bash
cd milestone-tracker && npm install && npx expo install react-dom react-native-web @expo/metro-runtime && npm run web
```

#### Terminal 3 (The Assistant - Chatbot Interface) 💬
Starts the web-based chatbot for parental guidance.

```bash
cd child-health-chatbot/frontend && npm install && npm run dev
```

#### Terminal 4 (The Research Pipeline - Data Security) 🔒
Demonstrates the HIPAA-compliant Salted SHA-256 video de-identification algorithm.

```bash
cd child-health-chatbot/backend && python video_hashing.py
```
*(View the console output to see secure hashing in action)*

## 🔓 Accessing the Application (Crucial)

To interact with the running applications, follow these steps:

1. Open the **PORTS** tab in your VS Code interface.
2. Right-click on **Port 8000**, **Port 8081**, and **Port 3000**.
3. Set **Port Visibility** to **Public** for all three.

### Access Points

- **Port 8081 (Globe Icon 🌐):** Opens the **Mobile Milestone Tracker**.
- **Port 3000 (Globe Icon 🌐):** Opens the **Web Chatbot**.
- **Terminal 4 Output:** Check the terminal where you ran `video_hashing.py` to view the secure hashing logs.

## 🏗 System Architecture

The toolkit is built on a robust, scalable architecture designed for performance and security.

### Backend ⚙️
- **Language:** Python 3.10
- **Framework:** FastAPI
- **Validation:** Pydantic (Data Validation)

### Frontend A (Mobile) 📱
- **Framework:** React Native (Expo)
- **Platform:** iOS/Android compatible

### Frontend B (Web) 💻
- **Framework:** React.js
- **Purpose:** Chatbot Interface

### Security 🛡️
- **Protocol:** Salted SHA-256 Hashing
- **Compliance:** Designed for GDPR/HIPAA compliance to ensure patient data privacy.
