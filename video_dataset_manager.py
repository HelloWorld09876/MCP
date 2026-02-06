import pandas as pd
import hashlib
import os
import shutil
from pathlib import Path
from datetime import datetime
import json
from typing import Dict, List, Tuple
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class VideoDatasetManager:
    """Manages annotated child development video datasets with privacy protection."""
    
    def __init__(self, csv_path: str, video_directory: str = None):
        """
        Initialize the dataset manager.
        
        Args:
            csv_path: Path to CSV file with video metadata
            video_directory: Directory containing video files (optional)
        """
        self.csv_path = csv_path
        self.video_directory = video_directory
        self.df = None
        self.mapping_file = "video_mapping.json"
        
        # Get SALT from environment variable or raise error
        self.salt = os.getenv('VIDEO_HASH_SALT')
        if not self.salt:
            raise ValueError(
                "VIDEO_HASH_SALT environment variable is not set. "
                "Please set it in your .env file for security. "
                "Example: VIDEO_HASH_SALT=your-random-secret-salt-here"
            )
        
        self.load_data()
    
    def load_data(self):
        """Load video metadata from CSV file."""
        try:
            self.df = pd.read_csv(self.csv_path)
            print(f"✅ Loaded {len(self.df)} video records from {self.csv_path}")
            print(f"\nColumns: {list(self.df.columns)}")
        except FileNotFoundError:
            print(f"❌ Error: CSV file not found at {self.csv_path}")
            raise
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            raise
    
    def generate_hash(self, filename: str, child_age: int, milestone_id: str) -> str:
        """
        Generate a salted unique hash for de-identification.
        
        Args:
            filename: Original filename
            child_age: Child's age in months
            milestone_id: Milestone identifier
            
        Returns:
            Unique hash string
        """
        # Combine multiple fields with SALT to ensure uniqueness and security
        unique_string = f"{self.salt}_{filename}_{child_age}_{milestone_id}_{datetime.now().isoformat()}"
        
        # Use SHA-256 with salt for secure hashing
        hash_object = hashlib.sha256(unique_string.encode('utf-8'))
        return hash_object.hexdigest()[:16]  # Use first 16 characters
    
    def deidentify_files(self, output_directory: str = None, dry_run: bool = True) -> Dict[str, str]:
        """
        De-identify video files by renaming them to unique salted hashes.
        
        Args:
            output_directory: Directory to save de-identified files (if None, renames in place)
            dry_run: If True, only shows what would be renamed without actually doing it
            
        Returns:
            Dictionary mapping original filenames to hashed filenames
        """
        if self.video_directory is None:
            print("⚠️ Warning: No video directory specified. Only generating hash mappings.")
        
        mapping = {}
        
        print(f"\n{'🔍 DRY RUN - ' if dry_run else '🔒 '}De-identifying files with salted SHA-256...")
        print(f"🔐 Using SALT from environment variable")
        print("-" * 60)
        
        for idx, row in self.df.iterrows():
            original_filename = row['filename']
            child_age = row['child_age']
            milestone_id = row['milestone_id']
            
            # Generate salted hash
            file_hash = self.generate_hash(original_filename, child_age, milestone_id)
            
            # Preserve file extension
            file_ext = Path(original_filename).suffix
            hashed_filename = f"{file_hash}{file_ext}"
            
            mapping[original_filename] = hashed_filename
            
            # Update DataFrame
            self.df.at[idx, 'hashed_filename'] = hashed_filename
            
            print(f"{idx + 1}. {original_filename} → {hashed_filename}")
            
            # Actually rename files if not dry run and directory exists
            if not dry_run and self.video_directory:
                source_path = Path(self.video_directory) / original_filename
                
                if output_directory:
                    dest_dir = Path(output_directory)
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest_path = dest_dir / hashed_filename
                else:
                    dest_path = Path(self.video_directory) / hashed_filename
                
                if source_path.exists():
                    try:
                        if output_directory:
                            shutil.copy2(source_path, dest_path)
                            print(f"   ✅ Copied to {dest_path}")
                        else:
                            source_path.rename(dest_path)
                            print(f"   ✅ Renamed to {dest_path}")
                    except Exception as e:
                        print(f"   ❌ Error: {e}")
                else:
                    print(f"   ⚠️ Warning: File not found at {source_path}")
        
        # Save mapping to JSON file
        mapping_path = Path(self.mapping_file)
        with open(mapping_path, 'w') as f:
            json.dump(mapping, f, indent=2)
        
        print(f"\n✅ Mapping saved to {mapping_path}")
        print(f"📊 Total files processed: {len(mapping)}")
        print(f"🔐 Security: Salted SHA-256 hashing enabled")
        
        return mapping
    
    def categorize_age_group(self, age_months: int) -> str:
        """
        Categorize age into groups.
        
        Args:
            age_months: Age in months
            
        Returns:
            Age group label
        """
        if age_months <= 6:
            return "0-6m"
        elif age_months <= 12:
            return "7-12m"
        elif age_months <= 18:
            return "13-18m"
        elif age_months <= 24:
            return "19-24m"
        elif age_months <= 30:
            return "25-30m"
        else:
            return "31-36m"
    
    def extract_domain(self, milestone_id: str) -> str:
        """
        Extract domain from milestone_id.
        
        Args:
            milestone_id: Milestone identifier (e.g., "M_12M_001", "L_12M_001")
            
        Returns:
            Domain name
        """
        # Extract first letter of milestone_id
        if not milestone_id or len(milestone_id) == 0:
            return "unknown"
        
        prefix = milestone_id[0].upper()
        domain_map = {
            'M': 'motor',
            'L': 'language',
            'S': 'social'
        }
        return domain_map.get(prefix, 'unknown')
    
    def generate_summary_report(self, output_file: str = "dataset_summary_report.txt") -> Dict:
        """
        Generate a comprehensive summary report of the dataset.
        
        Args:
            output_file: Path to save the summary report
            
        Returns:
            Dictionary containing summary statistics
        """
        # Add age groups and domains to DataFrame
        self.df['age_group'] = self.df['child_age'].apply(self.categorize_age_group)
        self.df['domain'] = self.df['milestone_id'].apply(self.extract_domain)
        
        # Calculate statistics
        total_videos = len(self.df)
        
        # Age group distribution
        age_distribution = self.df['age_group'].value_counts().sort_index()
        
        # Domain distribution
        domain_distribution = self.df['domain'].value_counts()
        
        # Label distribution
        label_distribution = self.df['label'].value_counts() if 'label' in self.df.columns else None
        
        # Cross-tabulation: Age group vs Domain
        age_domain_crosstab = pd.crosstab(self.df['age_group'], self.df['domain'])
        
        # Milestone distribution
        milestone_distribution = self.df['milestone_id'].value_counts()
        
        # Generate report
        report_lines = []
        report_lines.append("=" * 70)
        report_lines.append("CHILD DEVELOPMENT VIDEO DATASET SUMMARY REPORT")
        report_lines.append("=" * 70)
        report_lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append(f"Total Videos: {total_videos}")
        report_lines.append(f"Security: Salted SHA-256 hashing enabled")
        report_lines.append("")
        
        # Age Group Distribution
        report_lines.append("-" * 70)
        report_lines.append("📊 DISTRIBUTION BY AGE GROUP")
        report_lines.append("-" * 70)
        for age_group in sorted(age_distribution.index):
            count = age_distribution[age_group]
            percentage = (count / total_videos) * 100
            bar = "█" * int(percentage / 2)
            report_lines.append(f"{age_group:>10} | {count:>4} videos ({percentage:>5.1f}%) {bar}")
        report_lines.append("")
        
        # Domain Distribution
        report_lines.append("-" * 70)
        report_lines.append("🎯 DISTRIBUTION BY DOMAIN")
        report_lines.append("-" * 70)
        for domain in sorted(domain_distribution.index):
            count = domain_distribution[domain]
            percentage = (count / total_videos) * 100
            bar = "█" * int(percentage / 2)
            report_lines.append(f"{domain:>10} | {count:>4} videos ({percentage:>5.1f}%) {bar}")
        report_lines.append("")
        
        # Label Distribution
        if label_distribution is not None:
            report_lines.append("-" * 70)
            report_lines.append("✅ DISTRIBUTION BY LABEL")
            report_lines.append("-" * 70)
            for label in sorted(label_distribution.index):
                count = label_distribution[label]
                percentage = (count / total_videos) * 100
                bar = "█" * int(percentage / 2)
                report_lines.append(f"{label:>10} | {count:>4} videos ({percentage:>5.1f}%) {bar}")
            report_lines.append("")
        
        # Age Group vs Domain Cross-tabulation
        report_lines.append("-" * 70)
        report_lines.append("📈 AGE GROUP vs DOMAIN DISTRIBUTION")
        report_lines.append("-" * 70)
        report_lines.append(age_domain_crosstab.to_string())
        report_lines.append("")
        
        # Top Milestones
        report_lines.append("-" * 70)
        report_lines.append("🏆 TOP 10 MILESTONES BY VIDEO COUNT")
        report_lines.append("-" * 70)
        for idx, (milestone, count) in enumerate(milestone_distribution.head(10).items(), 1):
            report_lines.append(f"{idx:>2}. {milestone:>15} | {count:>4} videos")
        report_lines.append("")
        
        # Data Quality Checks
        report_lines.append("-" * 70)
        report_lines.append("🔍 DATA QUALITY CHECKS")
        report_lines.append("-" * 70)
        missing_filename = self.df['filename'].isna().sum()
        missing_age = self.df['child_age'].isna().sum()
        missing_milestone = self.df['milestone_id'].isna().sum()
        
        report_lines.append(f"Missing filenames:     {missing_filename}")
        report_lines.append(f"Missing ages:          {missing_age}")
        report_lines.append(f"Missing milestone_ids: {missing_milestone}")
        report_lines.append("")
        
        report_lines.append("=" * 70)
        
        # Print to console
        report_text = "\n".join(report_lines)
        print(report_text)
        
        # Save to file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        print(f"\n✅ Summary report saved to {output_file}")
        
        # Return statistics as dictionary
        summary = {
            'total_videos': total_videos,
            'age_distribution': age_distribution.to_dict(),
            'domain_distribution': domain_distribution.to_dict(),
            'label_distribution': label_distribution.to_dict() if label_distribution is not None else {},
            'age_domain_crosstab': age_domain_crosstab.to_dict(),
            'top_milestones': milestone_distribution.head(10).to_dict()
        }
        
        return summary
    
    def save_deidentified_csv(self, output_path: str = "deidentified_dataset.csv"):
        """
        Save the de-identified dataset to a new CSV file.
        
        Args:
            output_path: Path to save the de-identified CSV
        """
        if 'hashed_filename' not in self.df.columns:
            print("⚠️ Warning: Files have not been de-identified yet. Run deidentify_files() first.")
            return
        
        # Create a copy with hashed filenames
        deidentified_df = self.df.copy()
        deidentified_df['original_filename'] = deidentified_df['filename']
        deidentified_df['filename'] = deidentified_df['hashed_filename']
        
        # Save to CSV
        deidentified_df.to_csv(output_path, index=False)
        print(f"✅ De-identified dataset saved to {output_path}")


def main():
    """Main function demonstrating usage."""
    
    print("🏥 Child Development Video Dataset Manager")
    print("=" * 70)
    
    # Check for environment variable
    if not os.getenv('VIDEO_HASH_SALT'):
        print("\n⚠️ WARNING: VIDEO_HASH_SALT environment variable not set!")
        print("Please create a .env file with:")
        print("VIDEO_HASH_SALT=your-random-secret-salt-here")
        print("\nExample .env file content:")
        print("VIDEO_HASH_SALT=iiph_hyderabad_2026_secure_salt_xyz123")
        return
    
    # Example usage
    csv_path = "video_metadata.csv"
    video_dir = "videos"  # Optional
    
    try:
        # Initialize manager
        manager = VideoDatasetManager(csv_path, video_dir)
        
        # De-identify files (dry run first)
        print("\n" + "=" * 70)
        print("STEP 1: De-identifying Files (Dry Run)")
        print("=" * 70)
        mapping = manager.deidentify_files(output_directory="deidentified_videos", dry_run=True)
        
        # Generate summary report
        print("\n" + "=" * 70)
        print("STEP 2: Generating Summary Report")
        print("=" * 70)
        summary = manager.generate_summary_report()
        
        # Save de-identified CSV
        print("\n" + "=" * 70)
        print("STEP 3: Saving De-identified Dataset")
        print("=" * 70)
        manager.save_deidentified_csv()
        
        print("\n✅ All operations completed successfully!")
        
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        return


if __name__ == "__main__":
    main()
