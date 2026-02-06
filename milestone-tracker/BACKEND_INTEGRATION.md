# 🔗 Backend Integration Guide

## Overview

The React Native app is now fully integrated with the FastAPI backend for real-time milestone evaluation and developmental assessment.

## 🎯 Features

### 1. **Evaluate Progress Button**
- **Location**: Below age group tabs
- **Icon**: 📊 (changes to ⏳ while evaluating)
- **Bilingual**: "Evaluate Progress" / "प्रगति का मूल्यांकन करें"

### 2. **API Integration**
- **Endpoint**: `POST /evaluate`
- **Backend**: FastAPI on port 8000
- **CORS**: Configured for React Native connections

### 3. **Result Handling**

#### On Track ✅
- **Alert**: Green checkmark with success message
- **Title**: "On Track!" / "सही रास्ते पर!"
- **Message**: Congratulations with completion details

#### Needs Support 💛
- **Alert**: Yellow warning with support message
- **Title**: "Needs Support" / "सहायता की आवश्यकता है"
- **Message**: Encouragement to focus on activities

#### Referral Needed 🚨
- **Alert**: Red alert with urgent message
- **Title**: "Consult Health Worker" / "स्वास्थ्य कार्यकर्ता से परामर्श करें"
- **Message**: "Possible Developmental Delay Detected"
- **Details**: Instructions to consult healthcare professional

### 4. **Error Handling**
- **Network errors**: Graceful fallback with user-friendly message
- **CORS errors**: Handled automatically
- **Connection timeout**: Clear error message with troubleshooting tips

## 🔧 Technical Details

### API Configuration

```javascript
const API_BASE_URL = 'http://localhost:8000';
// For physical device: 'http://192.168.x.x:8000'
```

### Request Payload

```javascript
{
  "child_age_months": 12,
  "completed_milestones": ["M_12M_001", "M_12M_002", ...],
  "child_name": "Your Child"
}
```

### Response Format

```javascript
{
  "result": "On Track" | "Needs Support" | "Referral Needed",
  "completion_rate": 85.7,
  "total_expected": 10,
  "total_completed": 8,
  "missing_milestones": [...],
  "red_flags": [...],
  "recommendations": [...],
  "message": "Detailed evaluation message"
}
```

## 🚀 Setup Instructions

### 1. Start the Backend

```bash
cd c:\Users\adity\random\child-health-chatbot\backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn python-dotenv
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 2. Configure Mobile App

#### For Expo Go (Emulator)
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

#### For Physical Device
1. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Update API_BASE_URL in App.js:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:8000';  // Use your IP
   ```

3. Ensure phone and computer are on the **same Wi-Fi network**

### 3. Run the Mobile App

```bash
cd c:\Users\adity\random\milestone-tracker
npm install
npx expo start
```

## 📱 User Flow

1. **Parent marks milestones** for selected age (e.g., 12 months)
2. **Parent taps "Evaluate Progress"** button
3. **App sends data** to backend API
4. **Backend evaluates** completion rate and red flags
5. **App displays alert** based on result:
   - ✅ **On Track**: Success animation
   - 💛 **Needs Support**: Encouragement message
   - 🚨 **Referral Needed**: Urgent warning popup

## 🎨 Alert Examples

### On Track Alert
```
✅ On Track!

Great progress! Your child is developing well.

✅ Your Child (12 months) is developing well! 
All 10 expected milestones have been achieved. 
Continue with regular play and interaction.

[Great!]
```

### Referral Needed Alert
```
🚨 Consult Health Worker

Possible Developmental Delay Detected

Please consult with a health worker or pediatrician 
for a comprehensive assessment.

🚨 Your Child (12 months) has missed 2 critical 
milestone(s). Please consult a health worker as 
soon as possible.

[OK]
```

## 🔐 CORS Configuration

Backend is configured to accept requests from:
- `http://localhost:3000` (React web)
- `http://localhost:5173` (Vite)
- `http://localhost:19000` (Expo default)
- `http://localhost:19006` (Expo web)
- `exp://localhost:19000` (Expo app)
- `*` (All origins for mobile development)

## 🐛 Troubleshooting

### Error: "Unable to connect to evaluation service"

**Causes:**
1. Backend not running
2. Wrong IP address
3. Firewall blocking connection
4. Different Wi-Fi networks

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:8000

# 2. Verify IP address
ipconfig

# 3. Disable firewall temporarily
# Windows: Settings > Firewall > Allow app

# 4. Check Wi-Fi network
# Ensure phone and computer on same network
```

### Error: "Network request failed"

**Solution:**
- Use computer's IP instead of localhost for physical devices
- Check CORS settings in backend
- Restart Expo dev server

### Backend Returns 500 Error

**Solution:**
- Check backend logs for errors
- Verify milestone data file exists
- Ensure all dependencies installed

## 📊 Testing

### Test Case 1: All Milestones Completed
1. Mark all milestones as "Yes"
2. Tap "Evaluate Progress"
3. **Expected**: "On Track" alert with green checkmark

### Test Case 2: Some Milestones Missing
1. Mark 6/10 milestones as "Yes"
2. Tap "Evaluate Progress"
3. **Expected**: "Needs Support" alert with encouragement

### Test Case 3: Red Flag Milestone Missed
1. Mark critical milestone as "No"
2. Tap "Evaluate Progress"
3. **Expected**: "Referral Needed" alert with urgent warning

### Test Case 4: Backend Offline
1. Stop backend server
2. Tap "Evaluate Progress"
3. **Expected**: Connection error with troubleshooting message

## 🔮 Future Enhancements

- [ ] Show recommendations in-app (not just alert)
- [ ] Add evaluation history tracking
- [ ] Export evaluation report as PDF
- [ ] Offline evaluation with local logic
- [ ] Push notifications for evaluation reminders

---

**Backend + Frontend Integration Complete!** 🎉
