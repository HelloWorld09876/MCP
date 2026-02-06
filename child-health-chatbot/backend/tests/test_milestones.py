
import json
import pytest
from pathlib import Path

# Path to the data file
DATA_FILE_PATH = Path("data/milestones_data.json")

def test_milestone_options_validity():
    """
    Test that all milestone entries in milestones_data.json have a valid 'options' array.
    Each option must have 'label' and 'value' keys.
    """
    # Ensure file exists
    assert DATA_FILE_PATH.exists(), f"Data file not found at {DATA_FILE_PATH.absolute()}"

    # Load data
    with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
        milestones = json.load(f)

    # Check each milestone
    for milestone in milestones:
        milestone_id = milestone.get("milestone_id", "Unknown ID")
        
        # 1. Check 'options' key exists
        assert "options" in milestone, f"Milestone {milestone_id} is missing 'options' key"
        
        options = milestone["options"]
        
        # 2. Check 'options' is a list and not empty
        assert isinstance(options, list), f"Milestone {milestone_id} options is not a list"
        assert len(options) > 0, f"Milestone {milestone_id} has empty options list"
        
        # 3. Check each option has label and value
        for opt in options:
            assert "label" in opt, f"Milestone {milestone_id} option missing 'label'"
            assert "value" in opt, f"Milestone {milestone_id} option missing 'value'"
            assert opt["label"] in ["Yes", "No"], f"Milestone {milestone_id} has invalid label: {opt['label']}"
            assert opt["value"] in ["yes", "no"], f"Milestone {milestone_id} has invalid value: {opt['value']}"

if __name__ == "__main__":
    pytest.main([__file__])
