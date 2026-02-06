# 🏥 Child Health Chatbot System

An intelligent chatbot system for parents to get guidance on child developmental milestones, built with React + Tailwind CSS (frontend) and FastAPI (backend).

## 🌟 Features

### Frontend (React + Tailwind CSS)
- **Clean Chat Interface** - Modern, responsive chat window with gradient background
- **Message Bubbles** - Distinct styling for user and bot messages
- **Response Type Indicators** - Visual cues for normal, concern, and red flag responses
- **Quick Suggestions** - Pre-filled example queries for easy interaction
- **Bilingual Support** - Hindi and English labels throughout
- **Real-time Typing Indicator** - Shows when bot is processing

### Backend (FastAPI + Python)
- **NLP Query Parsing** - Extracts child age and milestone concerns from natural language
- **Intelligent Matching** - Matches queries against MCP milestone database
- **Red Flag Detection** - Identifies critical developmental delays requiring referral
- **Activity Suggestions** - Provides early stimulation activities based on domain
- **Age-based Logic** - Compares child's age against typical milestone ranges

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd child-health-chatbot/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the server:**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd child-health-chatbot/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
child-health-chatbot/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   └── data/
│       └── milestones_data.json   # MCP milestone database
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   └── components/
│   │       ├── ChatMessage.jsx   # Message bubble component
│   │       └── ChatInput.jsx     # Input field component
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
└── README.md
```

## 🎯 How It Works

### Query Processing Flow

1. **User Input** - Parent types a query (e.g., "My child is 10 months old but not crawling yet")

2. **Age Extraction** - Backend extracts child's age using regex patterns

3. **Concern Identification** - NLP logic identifies the milestone concern (crawling, walking, talking, etc.)

4. **Milestone Matching** - Finds relevant milestones from the database

5. **Response Generation** - Creates appropriate response based on:
   - **Normal**: Child is within expected range → Reassurance + activities
   - **Concern**: Child is delayed but not critical → Support + activities
   - **Red Flag**: Critical delay detected → Referral recommendation + activities

### Response Types

#### ✅ Normal Response
- Child is within expected developmental range
- Provides reassurance
- Suggests activities to support development

#### 💡 Concern Response
- Child is slightly delayed but not critical
- Offers supportive guidance
- Provides early stimulation activities

#### 🏥 Red Flag Response
- Critical developmental delay detected
- Recommends health worker referral
- Provides immediate action steps
- Still includes supportive activities

## 🔧 API Endpoints

### POST `/api/chat`

**Request:**
```json
{
  "message": "My child is 10 months old but not crawling yet",
  "child_age_months": 10  // Optional, can be extracted from message
}
```

**Response:**
```json
{
  "response": "Thank you for sharing your concern...",
  "response_type": "concern",  // "normal", "concern", or "red_flag"
  "suggested_activities": [
    "Place toys just out of reach to encourage crawling",
    "Help your child practice standing with support",
    "Create safe spaces for climbing and exploring"
  ],
  "referral_needed": false
}
```

## 📊 Milestone Database

The system uses a JSON database of MCP developmental milestones with the following structure:

```json
{
  "milestone_id": "M_9M_001",
  "age_range_months": {
    "min": 6,
    "max": 11,
    "typical": 9
  },
  "domain": "motor",
  "subdomain": "gross_motor",
  "milestone_description": "Crawls on hands and knees",
  "red_flag": false,
  "who_criteria": true
}
```

## 🎨 UI Components

### ChatMessage Component
- Dynamic styling based on response type
- Markdown-style formatting support
- Timestamp display
- Referral indicator badge

### ChatInput Component
- Multi-line textarea with auto-resize
- Send button with disabled state
- Quick suggestion buttons
- Enter key to send (Shift+Enter for new line)

## 🔮 Example Queries

Try these example queries:

- "My child is 10 months old but not crawling yet"
- "My 2-year-old is not talking much"
- "My 12-month-old cannot stand alone"
- "Is it normal that my 6-month-old can't sit?"
- "My child is 24 months and only says 10 words"

## 🏥 Integration with IIPH Hyderabad

This chatbot is designed to complement the MCP card digitization project by:

- Providing instant guidance to parents
- Reducing unnecessary health worker visits for normal variations
- Flagging critical delays for immediate attention
- Educating parents on early stimulation activities
- Supporting health workers with preliminary screening

## 🔐 Future Enhancements

- [ ] Multi-language support (Tamil, Telugu, Bengali, etc.)
- [ ] Voice input/output for low-literacy users
- [ ] Integration with video milestone tracker
- [ ] Chat history persistence
- [ ] Health worker dashboard
- [ ] SMS/WhatsApp integration
- [ ] Advanced NLP with transformer models
- [ ] Personalized activity recommendations
- [ ] Progress tracking over time

## 📄 License

This project is designed for public health use with IIPH Hyderabad.

## 🤝 Contributing

For questions or contributions, please contact the IIPH Hyderabad development team.

---

**Built with ❤️ for child health in India**
