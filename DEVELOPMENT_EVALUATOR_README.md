# 🏥 Development Evaluator - Decision Support System

A Python-based decision support algorithm for evaluating child development based on MCP (Mother and Child Protection) card logic.

## 🎯 Overview

This system evaluates a child's developmental progress by comparing completed milestones against age-appropriate expectations, identifying red flags, and providing personalized recommendations.

## ✨ Features

### 1. **Status Determination**
- **On Track** (100% completion) - All milestones achieved
- **Needs Support** (50-99% completion) - Some milestones missing
- **Referral Needed** (<50% completion OR red flag missed)

### 2. **Red Flag Detection**
Automatically identifies critical developmental delays that require immediate professional attention.

### 3. **Personalized Recommendations**
Provides age-appropriate early stimulation activities based on:
- Current development status
- Missing milestones
- Domain-specific needs (motor, language, social)

### 4. **Comprehensive Reporting**
- Completion rate percentage
- List of missing milestones
- Red flag alerts
- Parent-friendly messages

## 📋 Requirements

```bash
# No external dependencies required - uses only Python standard library
python >= 3.7
```

## 🚀 Usage

### Basic Example

```python
from development_evaluator import DevelopmentEvaluator

# Initialize evaluator
evaluator = DevelopmentEvaluator()

# Prepare child data
child_data = {
    'age_months': 12,
    'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001', 'L_12M_002'],
    'child_name': 'Aarav'  # Optional
}

# Evaluate development
result = evaluator.evaluate_development(child_data)

# Access results
print(f"Status: {result['status']}")
print(f"Completion: {result['completion_rate']}%")
print(f"Message: {result['message']}")
```

### With Custom Milestone Data

```python
# Load from JSON file
evaluator = DevelopmentEvaluator(milestones_file='milestones_data.json')

# Evaluate
result = evaluator.evaluate_development(child_data)
```

## 📊 Input Format

### Child Data Dictionary

```python
child_data = {
    'age_months': 12,                    # Required: Child's age in months
    'completed_milestones': [            # Required: List of milestone IDs
        'M_6M_001',
        'M_9M_001',
        'L_12M_002'
    ],
    'child_name': 'Aarav'               # Optional: Child's name for messages
}
```

### Milestone Data Format (JSON)

```json
[
  {
    "milestone_id": "M_12M_001",
    "age_range_months": {
      "min": 9,
      "max": 15,
      "typical": 12
    },
    "domain": "motor",
    "subdomain": "gross_motor",
    "milestone_description": "Stands alone without support",
    "red_flag": false
  }
]
```

## 📈 Output Format

```python
{
    'status': 'On Track',                    # Development status
    'completion_rate': 100.0,                # Percentage (0-100)
    'total_expected': 4,                     # Total milestones for age
    'total_completed': 4,                    # Milestones achieved
    'missing_milestones': [],                # List of missing milestone dicts
    'red_flags': [],                         # List of critical milestones missed
    'recommendations': [                     # Activity suggestions
        'Encourage tummy time...',
        'Play ball games...'
    ],
    'message': 'Aarav is developing well!'  # Parent-friendly summary
}
```

## 🎯 Decision Logic

### Status Determination

```
IF any red flag milestone is missed:
    → Status = 'Referral Needed'
ELSE IF completion_rate == 100%:
    → Status = 'On Track'
ELSE IF completion_rate >= 50%:
    → Status = 'Needs Support'
ELSE:
    → Status = 'Referral Needed'
```

### Red Flags

Milestones marked with `"red_flag": true` are critical indicators. Missing these triggers immediate referral recommendation regardless of overall completion rate.

**Example Red Flags:**
- Not using 50+ words by 24 months
- Not combining two words by 24 months
- No social smile by 6 months

## 💡 Activity Recommendations

### On Track
Provides **enrichment activities** across all domains for continued development.

### Needs Support
Provides **targeted activities** focused on domains with missing milestones.

### Referral Needed
Provides **supportive activities** PLUS strong recommendation to consult health worker.

## 📝 Test Cases & Results

### Test Case 1: On Track ✅

```python
child_data = {
    'age_months': 12,
    'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001', 'L_12M_002'],
    'child_name': 'Aarav'
}
```

**Result:**
- Status: `On Track`
- Completion: `100%` (4/4)
- Message: "Aarav is developing well! All 4 expected milestones have been achieved."

### Test Case 2: Needs Support 💛

```python
child_data = {
    'age_months': 12,
    'completed_milestones': ['M_6M_001', 'M_9M_001'],
    'child_name': 'Priya'
}
```

**Result:**
- Status: `Needs Support`
- Completion: `50%` (2/4)
- Message: "Priya is making progress. Focus on suggested activities..."

### Test Case 3: Referral Needed (Red Flag) 🚨

```python
child_data = {
    'age_months': 24,
    'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001'],
    'child_name': 'Ravi'
}
```

**Result:**
- Status: `Referral Needed`
- Red Flags: 2 (language milestones)
- Message: "Ravi has missed 2 critical milestone(s). Please consult health worker..."

### Test Case 4: Referral Needed (Low Completion) ⚠️

```python
child_data = {
    'age_months': 12,
    'completed_milestones': ['M_6M_001'],
    'child_name': 'Ananya'
}
```

**Result:**
- Status: `Referral Needed`
- Completion: `25%` (1/4)
- Message: "Ananya has achieved only 1 out of 4 milestones. Recommend consulting health worker..."

## 🔧 Customization

### Add Custom Activities

```python
evaluator.stimulation_activities['motor']['gross_motor'].append(
    "Your custom activity here"
)
```

### Modify Status Thresholds

Edit the `_determine_status()` method:

```python
def _determine_status(self, completion_rate: float, red_flags: List[Dict]) -> str:
    if red_flags:
        return 'Referral Needed'
    
    if completion_rate == 100:
        return 'On Track'
    elif completion_rate >= 75:  # Changed from 50
        return 'Needs Support'
    else:
        return 'Referral Needed'
```

## 🏥 Integration Examples

### With Mobile App

```python
# API endpoint
@app.post("/evaluate")
def evaluate_child(child_data: dict):
    evaluator = DevelopmentEvaluator()
    result = evaluator.evaluate_development(child_data)
    return result
```

### With Chatbot

```python
# In chatbot backend
def handle_evaluation_request(child_age, milestones):
    evaluator = DevelopmentEvaluator()
    result = evaluator.evaluate_development({
        'age_months': child_age,
        'completed_milestones': milestones
    })
    return result['message']
```

### Batch Processing

```python
# Evaluate multiple children
children = [
    {'age_months': 12, 'completed_milestones': [...]},
    {'age_months': 24, 'completed_milestones': [...]},
]

evaluator = DevelopmentEvaluator()
results = [evaluator.evaluate_development(child) for child in children]

# Generate summary report
referrals_needed = sum(1 for r in results if r['status'] == 'Referral Needed')
print(f"Children needing referral: {referrals_needed}")
```

## 📊 Activity Database

The system includes **50+ evidence-based activities** across:

- **Motor Skills**
  - Gross motor (7 activities)
  - Fine motor (7 activities)

- **Language Skills**
  - Receptive language (7 activities)
  - Expressive language (7 activities)

- **Social Skills**
  - Social-emotional (7 activities)

## 🔮 Future Enhancements

- [ ] Multi-language support for messages
- [ ] Age-specific activity filtering
- [ ] Progress tracking over time
- [ ] PDF report generation
- [ ] Integration with WHO growth charts
- [ ] Machine learning for personalized recommendations

## 📄 License

This system is designed for public health use with IIPH Hyderabad.

---

**Built for early childhood development support** 👶
