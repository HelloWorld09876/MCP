
import pytest
from unittest.mock import patch
import sys
import importlib
import json

# Sample invalid data (missing options)
INVALID_DATA = [
    {
        "milestone_id": "M_TEST_001",
        "age_range_months": {"min": 2, "max": 4, "typical": 3},
        "domain": "motor",
        "subdomain": "gross_motor",
        "milestone_description": "Test Milestone",
        "expected_response_type": "yes_no",
        "assessment_method": "Direct observation",
        "red_flag": False,
        "who_criteria": True
        # "options" is missing!
    }
]

def test_server_crashes_on_invalid_data():
    """
    Simulate loading invalid milestone data (missing options).
    The application should print a critical error and raise SystemExit(1).
    """
    # We patch json.load to return our invalid data
    with patch("json.load", return_value=INVALID_DATA):
        # We expect a SystemExit exception when main is imported/run
        with pytest.raises(SystemExit) as excinfo:
            # If main is already imported, we must reload it to trigger the top-level code again
            if 'main' in sys.modules:
                importlib.reload(sys.modules['main'])
            else:
                import main
        
        # Verify exit code is 1 (error)
        assert excinfo.value.code == 1

if __name__ == "__main__":
    pytest.main([__file__])
