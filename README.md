# IIPH Child Health Assessment Toolkit 🏥

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Section 1: 🚀 The 'One-Click' Cloud Setup (Run in 4 Terminals)

This sophisticated 4-part system is designed to run seamlessly on **GitHub Codespaces**. Follow these steps to launch the entire ecosystem.

### Terminal 1: The Brain (Backend API) 🧠
Data validation and AI logic engine.

```bash
cd child-health-chatbot/backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

### Terminal 2: The Mobile App (Parent Tracker) 📱
Interactive milestone tracking for parents.

```bash
cd milestone-tracker && npm install && npx expo install react-dom react-native-web @expo/metro-runtime && npm run web
```

### Terminal 3: The Chatbot Interface (Web) 💬
Web portal for asking developmental questions.

```bash
cd child-health-chatbot/frontend && npm install && npm run dev
```

### Terminal 4: The Research Pipeline (Data Security) 🔒
Simulates the HIPAA-compliant Salted SHA-256 hashing algorithm for patient video privacy.

```bash
cd child-health-chatbot/backend && python video_hashing.py
```
*(Note: View the console output to see the cryptographic hashing in action.)*

## Section 2: 🔓 Access Points (Crucial)

To interact with the running applications:

1. Open the **PORTS** tab in your VS Code interface.
2. Right-click on **Port 8000**, **Port 8081**, and **Port 3000** (or similar for frontend).
3. Set **Port Visibility** to **Public** for all.
4. Access the apps:
   - **Port 8081 (Globe Icon 🌐):** Opens the **Milestone Tracker App**.
   - **Port 3000 (Globe Icon 🌐):** Opens the **Chatbot Web Interface**.

### Terminal 4 Output
Check the terminal where you ran `video_hashing.py` to verify that video data is being securely de-identified before processing.

## Section 3: System Architecture

The toolkit is built on a robust, scalable architecture:

### Backend ⚙️
- **Framework:** FastAPI (Python 3.10)
- **Validation:** Pydantic models ensure strict data integrity.
- **AI Logic:** Integrated logic for developmental advice.

### Frontend 💻
- **Mobile:** React Native (Expo) for cross-platform availability.
- **Web:** React.js for the chatbot interface.

### Security 🛡️
- **Video Privacy:** Salted SHA-256 Hashing is used for automated video de-identification, ensuring patient data remains private and secure.

### Testing 🧪
- **Automated Suite:** Comprehensive Pytest suite covering milestone logic and API endpoints.
