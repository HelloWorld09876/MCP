from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import re
from typing import Optional, List, Dict

app = FastAPI(title="Child Health Chatbot API")

# CORS middleware for React frontend and React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://localhost:19000",  # Expo default
        "http://localhost:19006",  # Expo web
        "exp://localhost:19000",   # Expo app
        "*"  # Allow all origins for mobile development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load milestone data
with open("data/milestones_data.json", "r", encoding="utf-8") as f:
    MILESTONES_DATA = json.load(f)

# Early stimulation activities database
STIMULATION_ACTIVITIES = {
    "motor": {
        "gross_motor": [
            "Place toys just out of reach to encourage crawling",
            "Help your child practice standing with support",
            "Encourage walking by holding their hands",
            "Play games that involve rolling or throwing a ball",
            "Create safe spaces for climbing and exploring"
        ],
        "fine_motor": [
            "Provide blocks or cups for stacking",
            "Offer finger foods to practice pincer grasp",
            "Give crayons for scribbling practice",
            "Play with shape sorters or simple puzzles",
            "Practice opening and closing containers"
        ]
    },
    "language": {
        "receptive_language": [
            "Read picture books together daily",
            "Name objects and people around them",
            "Play simple games like 'Where is your nose?'",
            "Use simple, clear commands during daily routines",
            "Sing songs with actions"
        ],
        "expressive_language": [
            "Respond to their babbling with words",
            "Repeat and expand on their words",
            "Ask simple questions and wait for responses",
            "Narrate your daily activities",
            "Encourage imitation of sounds and words"
        ]
    },
    "social": {
        "social_emotional": [
            "Play peek-a-boo and other interactive games",
            "Arrange playtime with other children",
            "Respond warmly to their emotions",
            "Establish consistent daily routines",
            "Encourage pretend play with dolls or toys"
        ]
    }
}

class ChatQuery(BaseModel):
    message: str
    child_age_months: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    response_type: str  # "normal", "concern", "red_flag"
    suggested_activities: Optional[List[str]] = None
    referral_needed: bool = False

class EvaluationRequest(BaseModel):
    child_age_months: int
    completed_milestones: List[str]
    child_name: Optional[str] = "Child"

class EvaluationResponse(BaseModel):
    result: str  # "On Track", "Needs Support", "Referral Needed"
    completion_rate: float
    total_expected: int
    total_completed: int
    missing_milestones: List[Dict]
    red_flags: List[Dict]
    recommendations: List[str]
    message: str


def extract_age_from_message(message: str) -> Optional[int]:
    """Extract child's age in months from the message."""
    # Pattern: "X months", "X month", "X-month"
    patterns = [
        r'(\d+)\s*months?\s+old',
        r'(\d+)\s*months?',
        r'(\d+)-month',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            return int(match.group(1))
    
    # Pattern: "X years" - convert to months
    year_pattern = r'(\d+)\s*years?\s+old'
    match = re.search(year_pattern, message.lower())
    if match:
        return int(match.group(1)) * 12
    
    return None

def identify_milestone_concern(message: str) -> Optional[Dict]:
    """Identify which milestone the parent is concerned about."""
    message_lower = message.lower()
    
    # Keywords for different milestones
    milestone_keywords = {
        "crawling": ["crawl", "crawling", "creep", "moving"],
        "walking": ["walk", "walking", "steps", "stand"],
        "sitting": ["sit", "sitting"],
        "talking": ["talk", "talking", "speak", "speaking", "words", "saying"],
        "babbling": ["babble", "babbling", "sounds", "coo"],
        "grasping": ["grasp", "grasping", "hold", "holding", "pick up"],
        "social": ["smile", "smiling", "respond", "eye contact", "stranger"],
    }
    
    for concern, keywords in milestone_keywords.items():
        if any(keyword in message_lower for keyword in keywords):
            return {"concern": concern, "keywords": keywords}
    
    return None

def find_matching_milestones(concern: str, age_months: int) -> List[Dict]:
    """Find milestones matching the concern and age."""
    matching = []
    
    for milestone in MILESTONES_DATA:
        description_lower = milestone["milestone_description"].lower()
        
        # Check if milestone description matches the concern
        if concern in description_lower or any(
            keyword in description_lower 
            for keyword in ["crawl", "walk", "talk", "sit", "grasp", "social"]
        ):
            # Check if age is within or past the expected range
            if age_months >= milestone["age_range_months"]["min"]:
                matching.append(milestone)
    
    return matching

def generate_response(
    message: str, 
    age_months: Optional[int], 
    concern: Optional[Dict], 
    matching_milestones: List[Dict]
) -> ChatResponse:
    """Generate appropriate response based on the query analysis."""
    
    if not age_months:
        return ChatResponse(
            response="नमस्ते! 🙏 Hello! I'd be happy to help. Could you please tell me your child's age in months? For example: 'My child is 10 months old.'",
            response_type="normal",
            referral_needed=False
        )
    
    if not concern or not matching_milestones:
        return ChatResponse(
            response=f"I understand your child is {age_months} months old. Could you please tell me more about your specific concern? For example, what milestone or behavior are you worried about?",
            response_type="normal",
            referral_needed=False
        )
    
    # Analyze the matching milestones
    is_red_flag = False
    is_delayed = False
    relevant_milestone = None
    
    for milestone in matching_milestones:
        typical_age = milestone["age_range_months"]["typical"]
        max_age = milestone["age_range_months"]["max"]
        
        # Check if child is past the typical age
        if age_months > typical_age:
            is_delayed = True
            relevant_milestone = milestone
            
            # Check if it's a red flag
            if milestone.get("red_flag", False) and age_months > max_age:
                is_red_flag = True
                break
    
    # Generate response based on analysis
    if is_red_flag:
        response = f"🏥 **महत्वपूर्ण | Important Notice**\n\n"
        response += f"I understand your concern about your {age_months}-month-old child. "
        response += f"The milestone '{relevant_milestone['milestone_description']}' is typically achieved by {relevant_milestone['age_range_months']['typical']} months. "
        response += f"\n\n**⚠️ This is an important developmental marker.** I strongly recommend consulting with a health worker or pediatrician for a proper assessment. "
        response += f"Early intervention can make a significant difference.\n\n"
        response += f"**📍 Next Steps:**\n"
        response += f"1. Visit your nearest Anganwadi center or health clinic\n"
        response += f"2. Request a developmental screening\n"
        response += f"3. Bring your child's MCP card\n\n"
        response += f"In the meantime, here are some activities you can try:"
        
        return ChatResponse(
            response=response,
            response_type="red_flag",
            suggested_activities=get_activities_for_milestone(relevant_milestone),
            referral_needed=True
        )
    
    elif is_delayed:
        response = f"🌟 **सहायता | Support & Guidance**\n\n"
        response += f"Thank you for sharing your concern about your {age_months}-month-old child. "
        response += f"The milestone '{relevant_milestone['milestone_description']}' is typically achieved around {relevant_milestone['age_range_months']['typical']} months, "
        response += f"though children develop at different rates (normal range: {relevant_milestone['age_range_months']['min']}-{relevant_milestone['age_range_months']['max']} months).\n\n"
        response += f"**💡 Early Stimulation Activities:**\n"
        response += f"Here are some activities to encourage this development:\n\n"
        
        return ChatResponse(
            response=response,
            response_type="concern",
            suggested_activities=get_activities_for_milestone(relevant_milestone),
            referral_needed=False
        )
    
    else:
        response = f"✅ **आश्वासन | Reassurance**\n\n"
        response += f"Your {age_months}-month-old child is still within the normal developmental range for this milestone. "
        response += f"Every child develops at their own pace. The typical age for '{relevant_milestone['milestone_description']}' is around {relevant_milestone['age_range_months']['typical']} months.\n\n"
        response += f"**🎯 Activities to Support Development:**\n"
        
        return ChatResponse(
            response=response,
            response_type="normal",
            suggested_activities=get_activities_for_milestone(relevant_milestone),
            referral_needed=False
        )

def get_activities_for_milestone(milestone: Dict) -> List[str]:
    """Get relevant activities for a milestone."""
    domain = milestone["domain"]
    subdomain = milestone.get("subdomain", "")
    
    if domain in STIMULATION_ACTIVITIES:
        if subdomain and subdomain in STIMULATION_ACTIVITIES[domain]:
            return STIMULATION_ACTIVITIES[domain][subdomain][:3]
        else:
            # Return activities from first subdomain
            first_subdomain = list(STIMULATION_ACTIVITIES[domain].keys())[0]
            return STIMULATION_ACTIVITIES[domain][first_subdomain][:3]
    
    return []

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(query: ChatQuery):
    """Main chatbot endpoint."""
    try:
        # Extract age from message if not provided
        age_months = query.child_age_months
        if not age_months:
            age_months = extract_age_from_message(query.message)
        
        # Identify the concern
        concern = identify_milestone_concern(query.message)
        
        # Find matching milestones
        matching_milestones = []
        if concern and age_months:
            matching_milestones = find_matching_milestones(
                concern["concern"], 
                age_months
            )
        
        # Generate response
        response = generate_response(
            query.message,
            age_months,
            concern,
            matching_milestones
        )
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_milestones(request: EvaluationRequest):
    """
    Evaluate child's developmental progress based on completed milestones.
    Returns status, completion rate, and recommendations.
    """
    try:
        age_months = request.child_age_months
        completed_milestone_ids = request.completed_milestones
        child_name = request.child_name
        
        # Get expected milestones for this age
        expected_milestones = []
        for milestone in MILESTONES_DATA:
            # Include milestone if age is within or past the minimum age
            if age_months >= milestone["age_range_months"]["min"]:
                # Only include if age is within reasonable range (max + 6 months buffer)
                if age_months <= milestone["age_range_months"]["max"] + 6:
                    expected_milestones.append(milestone)
        
        if not expected_milestones:
            return EvaluationResponse(
                result="No Data",
                completion_rate=0.0,
                total_expected=0,
                total_completed=0,
                missing_milestones=[],
                red_flags=[],
                recommendations=[],
                message=f"No milestone data available for {age_months} months."
            )
        
        # Calculate completion
        total_expected = len(expected_milestones)
        completed_milestones = [
            m for m in expected_milestones 
            if m['milestone_id'] in completed_milestone_ids
        ]
        total_completed = len(completed_milestones)
        completion_rate = (total_completed / total_expected) * 100 if total_expected > 0 else 0
        
        # Identify missing milestones
        missing_milestones = [
            m for m in expected_milestones 
            if m['milestone_id'] not in completed_milestone_ids
        ]
        
        # Identify red flags
        red_flags = [m for m in missing_milestones if m.get('red_flag', False)]
        
        # Determine status
        if red_flags:
            status = 'Referral Needed'
        elif completion_rate == 100:
            status = 'On Track'
        elif completion_rate >= 50:
            status = 'Needs Support'
        else:
            status = 'Referral Needed'
        
        # Get recommendations
        recommendations = []
        if status == 'On Track':
            recommendations.append("🎉 Great progress! Continue with enrichment activities:")
            # Get activities from all domains
            for domain in ['motor', 'language', 'social']:
                if domain in STIMULATION_ACTIVITIES:
                    first_subdomain = list(STIMULATION_ACTIVITIES[domain].keys())[0]
                    recommendations.extend(STIMULATION_ACTIVITIES[domain][first_subdomain][:2])
        else:
            recommendations.append("💡 Focus on these activities to support development:")
            # Get activities for missing milestone domains
            domains_needed = set(m['domain'] for m in missing_milestones)
            for domain in domains_needed:
                if domain in STIMULATION_ACTIVITIES:
                    first_subdomain = list(STIMULATION_ACTIVITIES[domain].keys())[0]
                    recommendations.extend(STIMULATION_ACTIVITIES[domain][first_subdomain][:3])
        
        if status == 'Referral Needed':
            recommendations.append("\n⚠️ IMPORTANT: Please consult with a health worker or pediatrician for a comprehensive assessment.")
        
        # Generate message
        if status == 'On Track':
            message = f"✅ {child_name} ({age_months} months) is developing well! All {total_expected} expected milestones have been achieved. Continue with regular play and interaction."
        elif status == 'Needs Support':
            message = f"💛 {child_name} ({age_months} months) is making progress. {total_completed} out of {total_expected} milestones achieved ({completion_rate:.0f}%). Focus on suggested activities."
        else:
            if red_flags:
                message = f"🚨 {child_name} ({age_months} months) has missed {len(red_flags)} critical milestone(s). Please consult a health worker as soon as possible."
            else:
                message = f"⚠️ {child_name} ({age_months} months) has achieved only {total_completed} out of {total_expected} milestones ({completion_rate:.0f}%). We recommend consulting with a health worker."
        
        return EvaluationResponse(
            result=status,
            completion_rate=round(completion_rate, 1),
            total_expected=total_expected,
            total_completed=total_completed,
            missing_milestones=missing_milestones,
            red_flags=red_flags,
            recommendations=recommendations[:8],  # Limit to 8 recommendations
            message=message
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Child Health Chatbot API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "evaluate": "/evaluate"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
