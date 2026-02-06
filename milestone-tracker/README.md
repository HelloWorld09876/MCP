# 🌱 Developmental Milestone Tracker

A mobile app for tracking child developmental milestones (0-3 years) designed for parents in rural India, built with React Native and Expo.

## ✨ Features

### 📊 **Progress Timeline**
- Visual age markers from birth to 36 months
- Clear indicators showing current age
- Bilingual labels (Hindi/English)
- Emoji icons for easy recognition

### ✅ **Milestone Checklists**
- Organized by domain: Motor 🏃, Language 💬, Social 🤝
- Large Yes/No toggle buttons
- Visual feedback (green for completed, orange for incomplete)
- Red flag indicators for critical milestones
- Age range information for each milestone

### 📹 **Video Recording**
- Built-in camera integration
- Record child performing activities
- 30-second video limit
- Ready for AI analysis integration
- Bilingual instructions

### 🎨 **Accessibility Features**
- Large, colorful buttons
- Visual icons throughout
- Bilingual interface (Hindi/English)
- Designed for semi-literate users
- High contrast colors

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go app)

### Installation

1. **Navigate to project directory:**
```bash
cd milestone-tracker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Run on device:**
- **Android:** Press `a` or run `npm run android`
- **iOS:** Press `i` or run `npm run ios`
- **Physical Device:** Scan QR code with Expo Go app

## 📁 Project Structure

```
milestone-tracker/
├── App.js                          # Main app with navigation
├── package.json                    # Dependencies
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.js     # Main dashboard
│   │   └── VideoRecordingScreen.js # Video recording
│   ├── components/
│   │   ├── MilestoneItem.js       # Individual milestone card
│   │   └── ProgressTimeline.js    # Age timeline component
│   └── data/
│       └── milestones.js          # Sample milestone data
```

## 🎯 Key Components

### DashboardScreen
- Child information card
- Progress summary with completion percentage
- Milestones grouped by domain
- Save progress button

### MilestoneItem
- Milestone description with icon
- Yes/No toggle buttons
- Video recording button
- Age range display
- Red flag indicator for critical milestones

### ProgressTimeline
- Horizontal scrollable timeline
- Visual nodes for each age milestone
- Current age highlighted
- Past milestones shown in green

### VideoRecordingScreen
- Camera preview
- Recording timer
- Milestone context display
- Bilingual instructions

## 🔧 Customization

### Adding More Milestones
Edit `src/data/milestones.js` to add milestones from your JSON schema:

```javascript
export const sampleMilestones = [
  {
    milestone_id: "M_6M_001",
    age_range_months: { min: 4, max: 8, typical: 6 },
    domain: "motor",
    subdomain: "gross_motor",
    milestone_description: "Sits without support",
    expected_response_type: "yes_no",
    red_flag: false,
    who_criteria: true
  },
  // Add more milestones...
];
```

### Changing Child Age
In `DashboardScreen.js`, modify the initial state:

```javascript
const [childAge, setChildAge] = useState(12); // Change to desired age in months
```

### Language Support
All text is bilingual (Hindi/English). To add more languages, update text strings in components.

## 📱 Screenshots

The app features:
- **Clean, colorful interface** with green primary color
- **Large touch targets** for easy interaction
- **Visual icons** for every domain and milestone
- **Progress indicators** showing completion status
- **Bilingual labels** throughout

## 🔮 Future Enhancements

- [ ] AI video analysis integration
- [ ] Multi-child support
- [ ] Cloud data sync
- [ ] Offline mode
- [ ] Export reports (PDF)
- [ ] Health worker dashboard
- [ ] Regional language support (Tamil, Telugu, Bengali, etc.)
- [ ] Voice instructions
- [ ] Reminder notifications

## 🏥 Integration with IIPH Hyderabad

This app is designed to work with the MCP card digitization project. The milestone data structure follows WHO/MCP developmental criteria and can be easily integrated with backend APIs.

### API Integration Points
- Load milestones from server
- Save assessment responses
- Upload recorded videos
- Receive AI analysis results
- Sync data across devices

## 📄 License

This project is designed for public health use with IIPH Hyderabad.

## 🤝 Contributing

For questions or contributions, please contact the IIPH Hyderabad development team.

---

**Built with ❤️ for rural Indian families**
