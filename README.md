# IIPH Child Health Assessment Toolkit 🏥

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Executive Summary

The **IIPH Child Health Assessment Toolkit** is an integrated digital health platform designed to track and support child development from 0 to 24 months. By combining AI-driven advice with secure video monitoring, the platform empowers parents and caregivers with actionable insights into their child's motor, language, and social growth.

## Key Features

- **Smart Chatbot 🤖**
  - **Context-Aware Advice:** Delivers tailored guidance for Motor, Language, and Social development.
  - **Intent Detection:** Uses advanced keyword intent detection to understand user queries accurately.

- **Milestone Tracker 📅**
  - **Age-Specific Assessments:** Interactive assessment cards for key developmental stages (3, 6, 9, and 12 months).
  - **Track Progress:** Easily monitor growth and identify potential delays early.

- **Privacy-First 🔒**
  - **Secure Data:** Automated video de-identification ensures child privacy.
  - **Hashing:** Utilizes Salted SHA-256 Hashing to protect sensitive identifiers.

- **Fail-Safe Backend 🛡️**
  - **Data Integrity:** Implements strict Pydantic schema validation to ensure all data meets rigorous standards.
  - **Robust Architecture:** Designed to handle errors gracefully and maintain system stability.

## 🚀 Quick Start

### Run on GitHub Codespaces (No Install Required)

The easiest way to explore the toolkit is by using GitHub Codespaces.

1. Click the **Context Menu** on the top right of this repository.
2. Select **Code** > **Create Codespace**.

Once your Codespace is ready, open two terminals to run the backend and frontend services.

#### Terminal 1 (Backend)

Run the backend FastAPI server:

```bash
cd child-health-chatbot/backend
pip install -r requirements.txt
# Ensure dependencies like pandas, python-dotenv, fastapi, uvicorn, python-multipart are installed
uvicorn main:app --reload --port 8000
```

#### Terminal 2 (Frontend)

Run the React Native Expo app:

```bash
cd milestone-tracker
npm install
npx expo install react-dom react-native-web @expo/metro-runtime
npm run web
```

### Access the App

1. In the Codespace, navigate to the **Ports** tab.
2. Locate **Port 8081** (Frontend).
3. Click the **Globe Icon** 🌐 to open the application in your browser.

## Tech Stack

- **Language:** Python 3.10
- **Backend:** FastAPI
- **Frontend:** React Native (Expo)
- **Data Processing:** Pandas
