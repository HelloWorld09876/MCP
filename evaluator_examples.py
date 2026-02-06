"""
Example usage of the Development Evaluator with detailed output.
"""

from development_evaluator import DevelopmentEvaluator

def run_examples():
    """Run comprehensive examples of the evaluator."""
    
    print("=" * 80)
    print("🏥 CHILD DEVELOPMENT EVALUATION SYSTEM - EXAMPLES")
    print("=" * 80)
    print()
    
    # Initialize evaluator
    evaluator = DevelopmentEvaluator()
    
    # Example 1: Perfect development
    print("EXAMPLE 1: Child On Track (100% completion)")
    print("-" * 80)
    child1 = {
        'age_months': 12,
        'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001', 'L_12M_002'],
        'child_name': 'Aarav'
    }
    result1 = evaluator.evaluate_development(child1)
    print(f"Status: {result1['status']}")
    print(f"Completion: {result1['completion_rate']}% ({result1['total_completed']}/{result1['total_expected']})")
    print(f"Message: {result1['message']}")
    print(f"\nRecommendations ({len(result1['recommendations'])}):")
    for i, rec in enumerate(result1['recommendations'][:5], 1):
        print(f"  {i}. {rec}")
    print()
    
    # Example 2: Needs support
    print("\nEXAMPLE 2: Child Needs Support (50-99% completion)")
    print("-" * 80)
    child2 = {
        'age_months': 12,
        'completed_milestones': ['M_6M_001', 'M_9M_001'],
        'child_name': 'Priya'
    }
    result2 = evaluator.evaluate_development(child2)
    print(f"Status: {result2['status']}")
    print(f"Completion: {result2['completion_rate']}% ({result2['total_completed']}/{result2['total_expected']})")
    print(f"Missing Milestones: {len(result2['missing_milestones'])}")
    for milestone in result2['missing_milestones']:
        print(f"  - {milestone['milestone_description']}")
    print(f"\nMessage: {result2['message']}")
    print()
    
    # Example 3: Red flag - referral needed
    print("\nEXAMPLE 3: Referral Needed - Red Flag Alert")
    print("-" * 80)
    child3 = {
        'age_months': 24,
        'completed_milestones': ['M_6M_001', 'M_9M_001', 'M_12M_001'],
        'child_name': 'Ravi'
    }
    result3 = evaluator.evaluate_development(child3)
    print(f"Status: {result3['status']}")
    print(f"Completion: {result3['completion_rate']}% ({result3['total_completed']}/{result3['total_expected']})")
    print(f"🚨 RED FLAGS: {len(result3['red_flags'])}")
    for flag in result3['red_flags']:
        print(f"  ⚠️ {flag['milestone_description']}")
    print(f"\nMessage: {result3['message']}")
    print()
    
    # Example 4: Low completion - referral needed
    print("\nEXAMPLE 4: Referral Needed - Low Completion (<50%)")
    print("-" * 80)
    child4 = {
        'age_months': 12,
        'completed_milestones': ['M_6M_001'],
        'child_name': 'Ananya'
    }
    result4 = evaluator.evaluate_development(child4)
    print(f"Status: {result4['status']}")
    print(f"Completion: {result4['completion_rate']}% ({result4['total_completed']}/{result4['total_expected']})")
    print(f"Message: {result4['message']}")
    print()
    
    print("=" * 80)
    print("✅ All examples completed successfully!")
    print("=" * 80)


if __name__ == "__main__":
    run_examples()
