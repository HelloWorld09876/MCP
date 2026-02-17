# IIPH Child Health Assessment Toolkit 🏥

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Section 1: Project Overview

The **IIPH Child Health Assessment Toolkit** is a comprehensive 3-part ecosystem designed to support child development monitoring:

- **Backend Brain (FastAPI) 🧠**: The core intelligence that handles AI logic, data validation, and secure processing.
- **Mobile Tracker (React Native) 📱**: A dedicated mobile application for parents to track developmental milestones from 0-24 months.
- **Chatbot Interface (React) �**: An intuitive web portal for parents to ask questions and receive AI-driven advice on child development.

## Section 2: 🚀 The 'One-Click' Cloud Setup (Crucial Section)

This project is optimized for **GitHub Codespaces**, allowing you to run the entire stack without local installation.

### Step 1: Start Codespace
1. Click on the **Code** button at the top right of the repository.
2. Select the **Codespaces** tab.
3. Click **Create codespace on main**.

Once the Codespace is ready, open three separate terminals to run each component.

### Step 2: Terminal 1 - The Backend (Port 8000)
Run the following command to start the backend server:

```bash
cd child-health-chatbot/backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

### Step 3: Terminal 2 - The Mobile App (Port 8081)
Run the following command to launch the mobile tracker:

```bash
cd milestone-tracker && npm install && npx expo install react-dom react-native-web @expo/metro-runtime && npm run web
```

### Step 4: Terminal 3 - The Chatbot Web Interface (Port 3000)
Run the following command to start the chatbot web interface:

```bash
cd child-health-chatbot/frontend && npm install && npm run dev
```
*(Note: If prompted to use a different port, accept with 'y')*

## Section 3: 🔓 How to View the Apps

To access the running applications:

1. Go to the **PORTS** tab in your VS Code interface (usually at the bottom).
2. Right-click on **Port 8000**, **Port 8081**, and **Port 3000**.
3. Set **Port Visibility** to **Public** for all three.
4. Click the **Globe Icon** 🌐 next to:
   - **Port 8081** to open the **Mobile App**.
   - **Port 3000** to open the **Chatbot Interface**.

## Section 4: Architecture & Tech Stack

This project is built with a modern, scalable tech stack:

- **Backend:** Python 3.10, FastAPI, Pydantic (Data Validation), Uvicorn.
- **Mobile:** React Native, Expo, Node.js.
- **Web:** React.js, NPM.
- **Security:** Video Hashing (SHA-256) for ensuring patient privacy.
