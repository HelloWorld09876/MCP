import json
from typing import List, Dict, Tuple
from pathlib import Path


class DevelopmentEvaluator:
    """
    Decision support system for evaluating child development based on MCP card logic.
    """
    
    def __init__(self, milestones_file: str = None, recommendations_file: str = "recommendations.json"):
        """
        Initialize the evaluator with milestone data and recommendations.
        
        Args:
            milestones_file: Path to JSON file containing milestone data
            recommendations_file: Path to JSON file containing activity recommendations
        """
        self.milestones_data = []
        self.stimulation_activities = {}
        
        # Load milestones
        if milestones_file and Path(milestones_file).exists():
            self.load_milestones(milestones_file)
        else:
            self.load_default_milestones()
        
        # Load recommendations from external JSON file
        self.load_recommendations(recommendations_file)
    
    def load_milestones(self, filepath: str):
        """Load milestones from JSON file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                self.milestones_data = json.load(f)
            print(f"✅ Loaded {len(self.milestones_data)} milestones from {filepath}")
        except FileNotFoundError:
            print(f"⚠️ Warning: Milestones file not found at {filepath}. Using defaults.")
            self.load_default_milestones()
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing milestones JSON: {e}")
            self.load_default_milestones()
    
    def load_recommendations(self, filepath: str):
        """
        Load early stimulation activity recommendations from JSON file.
        
        Args:
            filepath: Path to recommendations JSON file
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                self.stimulation_activities = json.load(f)
            
            # Count total activities
            total_activities = sum(
                len(activities) 
                for domain in self.stimulation_activities.values() 
                for activities in domain.values()
            )
            print(f"✅ Loaded {total_activities} activity recommendations from {filepath}")
            
        except FileNotFoundError:
            print(f"❌ Error: Recommendations file not found at {filepath}")
            print(f"Please ensure {filepath} exists with activity recommendations.")
            raise FileNotFoundError(
                f"Recommendations file '{filepath}' is required but not found. "
                f"Please create this file with early stimulation activities."
            )
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing recommendations JSON: {e}")
            raise ValueError(f"Invalid JSON format in {filepath}: {e}")
    
    def load_default_milestones(self):
        """Load default milestone data if no file is provided."""
        # Sample milestones for demonstration
        self.milestones_data = [
            {
                "milestone_id": "M_6M_001",
                "age_range_months": {"min": 4, "max": 8, "typical": 6},
                "domain": "motor",
                "subdomain": "gross_motor",
                "milestone_description": "Sits without support",
                "red_flag": False
            },
            {
                "milestone_id": "M_9M_001",
                "age_range_months": {"min": 6, "max": 11, "typical": 9},
                "domain": "motor",
                "subdomain": "gross_motor",
                "milestone_description": "Crawls on hands and knees",
                "red_flag": False
            },
            {
                "milestone_id": "M_12M_001",
                "age_range_months": {"min": 9, "max": 15, "typical": 12},
                "domain": "motor",
                "subdomain": "gross_motor",
                "milestone_description": "Stands alone without support",
                "red_flag": False
            },
            {
                "milestone_id": "L_12M_002",
                "age_range_months": {"min": 10, "max": 18, "typical": 12},
                "domain": "language",
                "subdomain": "expressive_language",
                "milestone_description": "Says 'mama' and 'dada' correctly",
                "red_flag": False
            },
            {
                "milestone_id": "L_24M_003",
                "age_range_months": {"min": 18, "max": 30, "typical": 24},
                "domain": "language",
                "subdomain": "expressive_language",
                "milestone_description": "Uses at least 50 words",
                "red_flag": True
            },
            {
                "milestone_id": "L_24M_004",
                "age_range_months": {"min": 18, "max": 30, "typical": 24},
                "domain": "language",
                "subdomain": "expressive_language",
                "milestone_description": "Combines two words together",
                "red_flag": True
            }
        ]
        print(f"✅ Loaded {len(self.milestones_data)} default milestones")
    
    def get_expected_milestones(self, age_months: int) -> List[Dict]:
        """
        Get all milestones expected for a given age.
        
        Args:
            age_months: Child's age in months
            
        Returns:
            List of milestone dictionaries
        """
        expected = []
        for milestone in self.milestones_data:
            # Include milestone if age is within or past the typical age
            if age_months >= milestone["age_range_months"]["min"]:
                # Only include if age is within reasonable range
                if age_months <= milestone["age_range_months"]["max"] + 6:
                    expected.append(milestone)
        return expected
    
    def evaluate_development(self, child_data: Dict) -> Dict:
        """
        Evaluate a child's development based on completed milestones.
        
        Args:
            child_data: Dictionary containing:
                - age_months: int - Child's age in months
                - completed_milestones: List[str] - List of completed milestone IDs
                - child_name: str (optional) - Child's name
                
        Returns:
            Dictionary containing:
                - status: str - 'On Track', 'Needs Support', or 'Referral Needed'
                - completion_rate: float - Percentage of milestones completed
                - total_expected: int - Total milestones expected for age
                - total_completed: int - Total milestones completed
                - missing_milestones: List[Dict] - Milestones not yet achieved
                - red_flags: List[Dict] - Critical milestones missed
                - recommendations: List[str] - Suggested activities
                - message: str - Summary message for parents
        """
        age_months = child_data.get('age_months')
        completed_milestone_ids = child_data.get('completed_milestones', [])
        child_name = child_data.get('child_name', 'Your child')
        
        if not age_months:
            raise ValueError("age_months is required in child_data")
        
        # Get expected milestones for this age
        expected_milestones = self.get_expected_milestones(age_months)
        
        if not expected_milestones:
            return {
                'status': 'No Data',
                'completion_rate': 0.0,
                'total_expected': 0,
                'total_completed': 0,
                'missing_milestones': [],
                'red_flags': [],
                'recommendations': [],
                'message': f"No milestone data available for {age_months} months."
            }
        
        # Calculate completion
        total_expected = len(expected_milestones)
        completed_milestones = [m for m in expected_milestones 
                               if m['milestone_id'] in completed_milestone_ids]
        total_completed = len(completed_milestones)
        completion_rate = (total_completed / total_expected) * 100 if total_expected > 0 else 0
        
        # Identify missing milestones
        missing_milestones = [m for m in expected_milestones 
                             if m['milestone_id'] not in completed_milestone_ids]
        
        # Identify red flags
        red_flags = [m for m in missing_milestones if m.get('red_flag', False)]
        
        # Determine status
        status = self._determine_status(completion_rate, red_flags)
        
        # Get recommendations
        recommendations = self._get_recommendations(
            status, missing_milestones, completed_milestones, age_months
        )
        
        # Generate message
        message = self._generate_message(
            child_name, age_months, status, completion_rate, 
            total_completed, total_expected, red_flags
        )
        
        return {
            'status': status,
            'completion_rate': round(completion_rate, 1),
            'total_expected': total_expected,
            'total_completed': total_completed,
            'missing_milestones': missing_milestones,
            'red_flags': red_flags,
            'recommendations': recommendations,
            'message': message
        }
    
    def _determine_status(self, completion_rate: float, red_flags: List[Dict]) -> str:
        """
        Determine development status based on completion rate and red flags.
        
        Args:
            completion_rate: Percentage of milestones completed
            red_flags: List of critical milestones missed
            
        Returns:
            Status string
        """
        # Red flag takes priority
        if red_flags:
            return 'Referral Needed'
        
        # Check completion rate
        if completion_rate == 100:
            return 'On Track'
        elif completion_rate >= 50:
            return 'Needs Support'
        else:
            return 'Referral Needed'
    
    def _get_recommendations(
        self, 
        status: str, 
        missing_milestones: List[Dict],
        completed_milestones: List[Dict],
        age_months: int
    ) -> List[str]:
        """
        Get activity recommendations based on status and milestones.
        
        Args:
            status: Development status
            missing_milestones: List of missing milestones
            completed_milestones: List of completed milestones
            age_months: Child's age in months
            
        Returns:
            List of recommended activities
        """
        recommendations = []
        
        if status == 'On Track':
            # Provide general enrichment activities
            recommendations.append("🎉 Great progress! Continue with these enrichment activities:")
            
            # Get activities from all domains for well-rounded development
            for domain in ['motor', 'language', 'social']:
                domain_activities = self._get_domain_activities(domain)
                if domain_activities:
                    recommendations.extend(domain_activities[:2])  # 2 per domain
        
        else:
            # Focus on missing milestones
            recommendations.append("💡 Focus on these activities to support development:")
            
            # Group missing milestones by domain
            domains_needed = {}
            for milestone in missing_milestones:
                domain = milestone['domain']
                subdomain = milestone.get('subdomain', '')
                if domain not in domains_needed:
                    domains_needed[domain] = []
                domains_needed[domain].append(subdomain)
            
            # Get targeted activities
            for domain, subdomains in domains_needed.items():
                subdomain = subdomains[0] if subdomains else ''
                activities = self._get_domain_activities(domain, subdomain)
                if activities:
                    recommendations.extend(activities[:3])  # 3 per domain
        
        # Add general advice
        if status == 'Referral Needed':
            recommendations.append("\n⚠️ IMPORTANT: Please consult with a health worker or pediatrician for a comprehensive assessment.")
        
        return recommendations
    
    def _get_domain_activities(self, domain: str, subdomain: str = None) -> List[str]:
        """
        Get activities for a specific domain and subdomain.
        
        Args:
            domain: Domain name (motor, language, social)
            subdomain: Subdomain name (optional)
            
        Returns:
            List of activity recommendations
        """
        if domain not in self.stimulation_activities:
            return []
        
        domain_data = self.stimulation_activities[domain]
        
        if subdomain and subdomain in domain_data:
            return domain_data[subdomain][:3]
        else:
            # Return from first available subdomain
            if domain_data:
                first_subdomain = list(domain_data.keys())[0]
                return domain_data[first_subdomain][:3]
            return []
    
    def _generate_message(
        self,
        child_name: str,
        age_months: int,
        status: str,
        completion_rate: float,
        total_completed: int,
        total_expected: int,
        red_flags: List[Dict]
    ) -> str:
        """Generate a parent-friendly message."""
        
        if status == 'On Track':
            message = f"✅ {child_name} ({age_months} months) is developing well! "
            message += f"All {total_expected} expected milestones have been achieved. "
            message += "Continue with regular play and interaction to support continued growth."
        
        elif status == 'Needs Support':
            message = f"💛 {child_name} ({age_months} months) is making progress. "
            message += f"{total_completed} out of {total_expected} milestones achieved ({completion_rate:.0f}%). "
            message += "Focus on the suggested activities to support development in areas that need attention."
        
        else:  # Referral Needed
            if red_flags:
                message = f"🚨 {child_name} ({age_months} months) has missed {len(red_flags)} critical milestone(s). "
                message += "Please consult a health worker or pediatrician as soon as possible for proper assessment. "
            else:
                message = f"⚠️ {child_name} ({age_months} months) has achieved only {total_completed} out of {total_expected} milestones ({completion_rate:.0f}%). "
                message += "We recommend consulting with a health worker for guidance and support. "
            
            message += "Early intervention can make a significant difference."
        
        return message


def main():
    """Demonstration of the development evaluator."""
    
    print("=" * 70)
    print("🏥 CHILD DEVELOPMENT EVALUATION SYSTEM")
    print("=" * 70)
    print()
    
    try:
        # Initialize evaluator with external recommendations file
        evaluator = DevelopmentEvaluator(recommendations_file="recommendations.json")
        
        # Test Case 1: Child on track (12 months, all milestones)
        print("TEST CASE 1: Child On Track")
        print("-" * 70)
        child1 = {
            'age_months': 12,
            'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001', 'L_12M_002'],
            'child_name': 'Aarav'
        }
        result1 = evaluator.evaluate_development(child1)
        print_result(result1)
        
        # Test Case 2: Child needs support (12 months, some milestones)
        print("\nTEST CASE 2: Child Needs Support")
        print("-" * 70)
        child2 = {
            'age_months': 12,
            'completed_milestones': ['M_6M_001', 'M_9M_001'],
            'child_name': 'Priya'
        }
        result2 = evaluator.evaluate_development(child2)
        print_result(result2)
        
        # Test Case 3: Referral needed - Red flag (24 months, missing critical language)
        print("\nTEST CASE 3: Referral Needed (Red Flag)")
        print("-" * 70)
        child3 = {
            'age_months': 24,
            'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001'],
            'child_name': 'Ravi'
        }
        result3 = evaluator.evaluate_development(child3)
        print_result(result3)
        
        # Test Case 4: Referral needed - Low completion (<50%)
        print("\nTEST CASE 4: Referral Needed (Low Completion)")
        print("-" * 70)
        child4 = {
            'age_months': 12,
            'completed_milestones': ['M_6M_001'],
            'child_name': 'Ananya'
        }
        result4 = evaluator.evaluate_development(child4)
        print_result(result4)
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nPlease ensure recommendations.json exists in the current directory.")
        return
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return


def print_result(result: Dict):
    """Pretty print evaluation result."""
    print(f"\n📊 Status: {result['status']}")
    print(f"📈 Completion: {result['completion_rate']}% ({result['total_completed']}/{result['total_expected']})")
    
    if result['red_flags']:
        print(f"\n🚨 RED FLAGS ({len(result['red_flags'])}):")
        for flag in result['red_flags']:
            print(f"   - {flag['milestone_description']}")
    
    if result['missing_milestones'] and not result['red_flags']:
        print(f"\n⏳ Missing Milestones ({len(result['missing_milestones'])}):")
        for milestone in result['missing_milestones'][:3]:
            print(f"   - {milestone['milestone_description']}")
    
    print(f"\n💬 Message:")
    print(f"   {result['message']}")
    
    print(f"\n💡 Recommendations:")
    for rec in result['recommendations'][:5]:
        print(f"   {rec}")
    
    print()


if __name__ == "__main__":
    main()
