import os
import csv
import json
from pathlib import Path
import gzip

def process_csv_files():
    """Process all CSV files in the cagematch_scrapper directory and create a JSON database."""

    csv_dir = Path("./cagematch_scrapper")
    wrestlers_data = []
    total_matches = 0

    if not csv_dir.exists():
        print(f"Directory {csv_dir} not found!")
        return

    # Get all CSV files
    csv_files = list(csv_dir.glob("*_matches.csv"))
    print(f"Found {len(csv_files)} CSV files to process...")

    for csv_file in csv_files:
        wrestler_name = csv_file.stem.replace('_matches', '').replace('_', ' ')
        matches = []
        image_url = None

        try:
            with open(csv_file, 'r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    matches.append(row)
                    if row.get('image_url'):
                        image_url = row['image_url']

            if matches:  # Only add wrestlers with matches
                wrestler_data = {
                    'name': wrestler_name,
                    'filename': csv_file.name,
                    'matches': matches,
                    'totalMatches': len(matches),
                    'image_url': image_url
                }
                wrestlers_data.append(wrestler_data)
                total_matches += len(matches)

                if len(wrestlers_data) % 50 == 0:
                    print(f"Processed {len(wrestlers_data)} wrestlers...")

        except Exception as e:
            print(f"Error processing {csv_file.name}: {e}")
            continue

    # Sort by total matches (most active first)
    wrestlers_data.sort(key=lambda x: x['totalMatches'], reverse=True)

    # Take only the first 100 wrestlers
    wrestlers_data = wrestlers_data[:100]

    # Create summary statistics
    stats = {
        'totalWrestlers': len(wrestlers_data),
        'totalMatches': total_matches,
        'avgMatchesPerWrestler': round(total_matches / len(wrestlers_data)) if wrestlers_data else 0,
        'topWrestlers': wrestlers_data[:10],
        'lastUpdated': str(csv_dir.stat().st_mtime) if csv_dir.exists() else None
    }

    # Save the processed data
    output_data = {
        'stats': stats,
        'wrestlers': wrestlers_data
    }

    with open('wrestling_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    with gzip.open('wrestling_data.json.gz', 'wt', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print("\n✅ Processing complete!")
    print(f"📊 Total wrestlers: {len(wrestlers_data)}")
    print(f"🏆 Total matches: {total_matches}")
    print(f"📈 Average matches per wrestler: {stats['avgMatchesPerWrestler']}")
    print("💾 Data saved to wrestling_data.json and wrestling_data.json.gz")
if __name__ == "__main__":
    process_csv_files()

