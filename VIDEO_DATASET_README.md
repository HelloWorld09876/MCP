# 🎥 Video Dataset Manager

A Python script for managing annotated child development video datasets with privacy protection and analytics.

## 🌟 Features

### 1. **Privacy Protection (De-identification)**
- Generates unique SHA-256 hashes for each video file
- Renames files to protect child identity
- Maintains mapping file for reference
- Preserves file extensions
- Supports dry-run mode to preview changes

### 2. **Dataset Analytics**
- Distribution by age groups (0-6m, 7-12m, 13-18m, etc.)
- Distribution by domain (motor, language, social)
- Distribution by labels (achieved/not_achieved)
- Cross-tabulation of age groups vs domains
- Top milestones by video count
- Data quality checks

### 3. **Report Generation**
- Comprehensive text-based summary reports
- Visual bar charts using ASCII characters
- Exportable statistics in JSON format
- Automatic timestamp tracking

## 📋 Requirements

```bash
pip install pandas
```

## 🚀 Usage

### Basic Usage

```python
from video_dataset_manager import VideoDatasetManager

# Initialize manager
manager = VideoDatasetManager(
    csv_path="video_metadata.csv",
    video_directory="videos"  # Optional
)

# De-identify files (dry run)
mapping = manager.deidentify_files(
    output_directory="deidentified_videos",
    dry_run=True
)

# Generate summary report
summary = manager.generate_summary_report()

# Save de-identified CSV
manager.save_deidentified_csv()
```

### Command Line Usage

```bash
python video_dataset_manager.py
```

## 📊 CSV Format

The input CSV should have the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `filename` | string | Original video filename |
| `child_age` | integer | Child's age in months |
| `milestone_id` | string | Milestone identifier (e.g., M_12M_001) |
| `label` | string | Achievement label (achieved/not_achieved) |

### Example CSV

```csv
filename,child_age,milestone_id,label
video_001.mp4,6,M_6M_001,achieved
video_002.mp4,12,L_12M_001,not_achieved
video_003.mp4,24,S_24M_001,achieved
```

## 🔒 De-identification Process

### How It Works

1. **Hash Generation**: Combines filename, age, milestone_id, and timestamp
2. **SHA-256 Hashing**: Creates unique 16-character hash
3. **File Renaming**: Renames files while preserving extensions
4. **Mapping Storage**: Saves original→hashed mapping to JSON

### Example

```
Original: video_001.mp4
Hashed:   a3f5d8e2c1b4f6a9.mp4
```

### Dry Run Mode

Always test with `dry_run=True` first to preview changes:

```python
mapping = manager.deidentify_files(dry_run=True)
```

### Actual De-identification

```python
mapping = manager.deidentify_files(
    output_directory="deidentified_videos",
    dry_run=False
)
```

## 📈 Summary Report Example

```
======================================================================
CHILD DEVELOPMENT VIDEO DATASET SUMMARY REPORT
======================================================================
Generated: 2026-02-05 20:38:45
Total Videos: 25

----------------------------------------------------------------------
📊 DISTRIBUTION BY AGE GROUP
----------------------------------------------------------------------
      0-6m |    3 videos ( 12.0%) ██████
     7-12m |    7 videos ( 28.0%) ██████████████
    13-18m |    3 videos ( 12.0%) ██████
    19-24m |    5 videos ( 20.0%) ██████████
    25-30m |    2 videos (  8.0%) ████
    31-36m |    5 videos ( 20.0%) ██████████

----------------------------------------------------------------------
🎯 DISTRIBUTION BY DOMAIN
----------------------------------------------------------------------
  language |    9 videos ( 36.0%) ██████████████████
     motor |   11 videos ( 44.0%) ██████████████████████
    social |    5 videos ( 20.0%) ██████████

----------------------------------------------------------------------
✅ DISTRIBUTION BY LABEL
----------------------------------------------------------------------
  achieved |   21 videos ( 84.0%) ██████████████████████████████████████████
not_achieved |    4 videos ( 16.0%) ████████
```

## 🎯 Age Group Categories

| Age Group | Range (months) |
|-----------|----------------|
| 0-6m | 0-6 |
| 7-12m | 7-12 |
| 13-18m | 13-18 |
| 19-24m | 19-24 |
| 25-30m | 25-30 |
| 31-36m | 31-36 |

## 🔍 Domain Extraction

Domains are automatically extracted from milestone IDs:

- **M_** prefix → Motor domain
- **L_** prefix → Language domain
- **S_** prefix → Social domain

## 📁 Output Files

### 1. `video_mapping.json`
Maps original filenames to hashed filenames:
```json
{
  "video_001.mp4": "a3f5d8e2c1b4f6a9.mp4",
  "video_002.mp4": "b7c9e1f3d5a8b2c4.mp4"
}
```

### 2. `dataset_summary_report.txt`
Comprehensive text report with all statistics

### 3. `deidentified_dataset.csv`
CSV with hashed filenames and all metadata

## 🔧 Advanced Features

### Custom Age Groups

Modify the `categorize_age_group()` method:

```python
def categorize_age_group(self, age_months: int) -> str:
    if age_months <= 3:
        return "0-3m"
    elif age_months <= 6:
        return "4-6m"
    # ... custom ranges
```

### Custom Domain Mapping

Modify the `extract_domain()` method:

```python
domain_map = {
    'M': 'motor',
    'L': 'language',
    'S': 'social',
    'C': 'cognitive'  # Add new domain
}
```

## 🛡️ Privacy Best Practices

1. **Always use dry run first** to verify changes
2. **Keep mapping file secure** - it contains the de-identification key
3. **Store original files separately** before de-identification
4. **Use output_directory** to preserve originals
5. **Backup data** before running de-identification

## 📊 Use Cases

### Research Dataset Preparation
```python
manager = VideoDatasetManager("research_videos.csv", "raw_videos")
manager.deidentify_files("anonymized_videos", dry_run=False)
manager.generate_summary_report("research_summary.txt")
```

### Quality Assurance
```python
manager = VideoDatasetManager("qa_dataset.csv")
summary = manager.generate_summary_report()
# Check for data imbalances
print(summary['domain_distribution'])
```

### Dataset Sharing
```python
manager = VideoDatasetManager("dataset.csv", "videos")
manager.deidentify_files("shared_dataset", dry_run=False)
manager.save_deidentified_csv("shared_metadata.csv")
# Share: shared_dataset/ + shared_metadata.csv
```

## 🔮 Future Enhancements

- [ ] Support for multiple video formats
- [ ] Automatic video validation
- [ ] Integration with cloud storage
- [ ] Batch processing for large datasets
- [ ] Video thumbnail generation
- [ ] Metadata extraction from videos
- [ ] Export to ML training formats

## 📄 License

This script is designed for research and public health use with IIPH Hyderabad.

---

**Built for child development research with privacy in mind** 🔒
