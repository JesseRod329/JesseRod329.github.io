#!/usr/bin/env python3
"""
Script to embed JSON data into the enhanced rule finder HTML file
"""

import json
import re

def embed_data():
    # Read the JSON data
    with open('rule_analysis.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Read the HTML template
    with open('enhanced_rule_finder_embedded.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Convert data to JavaScript format
    js_data = json.dumps(data, indent=2, ensure_ascii=False)
    
    # Replace the placeholder in the HTML
    pattern = r'const RULES_DATA = \{[^}]*\};'
    replacement = f'const RULES_DATA = {js_data};'
    
    updated_html = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    # Write the updated HTML file
    with open('enhanced_rule_finder_embedded.html', 'w', encoding='utf-8') as f:
        f.write(updated_html)
    
    print("Data embedded successfully!")
    print(f"Total rules: {len(data['rules'])}")
    print("You can now open enhanced_rule_finder_embedded.html in your browser")

if __name__ == "__main__":
    embed_data()
