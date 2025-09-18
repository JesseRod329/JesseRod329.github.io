#!/usr/bin/env python3
"""
Rule Analyzer for Awesome Cursor Rules
Analyzes and categorizes .cursorrules files to create a better organization system.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict, Counter

@dataclass
class RuleMetadata:
    """Metadata for a cursor rule file"""
    name: str
    path: str
    file_size: int
    technologies: List[str]
    categories: List[str]
    complexity: str  # simple, medium, complex
    focus_areas: List[str]
    dependencies: List[str]
    patterns: List[str]
    description: str
    keywords: List[str]

class RuleAnalyzer:
    def __init__(self, rules_dir: str):
        self.rules_dir = Path(rules_dir)
        self.rules: List[RuleMetadata] = []
        self.technology_patterns = self._load_technology_patterns()
        self.category_patterns = self._load_category_patterns()
        
    def _load_technology_patterns(self) -> Dict[str, List[str]]:
        """Load patterns for detecting technologies in rule files"""
        return {
            'frontend': [
                'react', 'vue', 'angular', 'svelte', 'nextjs', 'next.js', 'nuxt', 'astro', 'qwik',
                'solidjs', 'solid.js', 'typescript', 'javascript', 'jsx', 'tsx', 'html', 'css',
                'tailwind', 'tailwindcss', 'chakra', 'mui', 'material-ui', 'shadcn', 'radix'
            ],
            'backend': [
                'nodejs', 'node.js', 'express', 'fastapi', 'django', 'flask', 'laravel', 'rails',
                'spring', 'springboot', 'go', 'golang', 'rust', 'python', 'php', 'java', 'kotlin',
                'elixir', 'phoenix', 'deno', 'convex', 'supabase'
            ],
            'mobile': [
                'react-native', 'expo', 'flutter', 'swift', 'swiftui', 'uikit', 'android',
                'jetpack', 'compose', 'nativescript', 'ionic'
            ],
            'database': [
                'mongodb', 'postgres', 'postgresql', 'mysql', 'redis', 'sqlite', 'prisma',
                'sqlalchemy', 'typeorm', 'sequelize'
            ],
            'testing': [
                'jest', 'cypress', 'playwright', 'vitest', 'testing', 'test', 'e2e', 'unit',
                'integration', 'accessibility', 'detox'
            ],
            'devops': [
                'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'vercel', 'netlify', 'ci', 'cd',
                'github', 'gitlab', 'jenkins'
            ],
            'blockchain': [
                'solidity', 'web3', 'ethereum', 'foundry', 'hardhat', 'viem', 'wagmi'
            ],
            'ai_ml': [
                'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'llm', 'ai', 'ml'
            ]
        }
    
    def _load_category_patterns(self) -> Dict[str, List[str]]:
        """Load patterns for detecting categories in rule files"""
        return {
            'web_development': ['web', 'frontend', 'backend', 'fullstack', 'spa', 'ssr', 'ssg'],
            'mobile_development': ['mobile', 'ios', 'android', 'app', 'native'],
            'api_development': ['api', 'rest', 'graphql', 'microservice', 'endpoint'],
            'testing_qa': ['test', 'testing', 'qa', 'quality', 'e2e', 'unit', 'integration'],
            'devops_deployment': ['deploy', 'devops', 'ci', 'cd', 'docker', 'kubernetes'],
            'data_science': ['data', 'analytics', 'ml', 'ai', 'pandas', 'numpy'],
            'blockchain': ['blockchain', 'crypto', 'web3', 'defi', 'nft'],
            'game_development': ['game', 'unity', 'unreal', 'graphics', '3d'],
            'desktop_apps': ['desktop', 'electron', 'tauri', 'native'],
            'documentation': ['docs', 'documentation', 'readme', 'guide']
        }
    
    def analyze_rule_file(self, file_path: Path) -> RuleMetadata:
        """Analyze a single .cursorrules file and extract metadata"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
        
        # Extract name from path
        name = file_path.parent.name.replace('-cursorrules-prompt-file', '').replace('-cursorrules-prompt-fil', '')
        
        # Detect technologies
        technologies = self._detect_technologies(content)
        
        # Detect categories
        categories = self._detect_categories(content, technologies)
        
        # Determine complexity
        complexity = self._determine_complexity(content)
        
        # Extract focus areas
        focus_areas = self._extract_focus_areas(content)
        
        # Extract dependencies
        dependencies = self._extract_dependencies(content)
        
        # Extract patterns
        patterns = self._extract_patterns(content)
        
        # Generate description
        description = self._generate_description(content, technologies, categories)
        
        # Extract keywords
        keywords = self._extract_keywords(content)
        
        return RuleMetadata(
            name=name,
            path=str(file_path.relative_to(self.rules_dir)),
            file_size=file_path.stat().st_size,
            technologies=technologies,
            categories=categories,
            complexity=complexity,
            focus_areas=focus_areas,
            dependencies=dependencies,
            patterns=patterns,
            description=description,
            keywords=keywords
        )
    
    def _detect_technologies(self, content: str) -> List[str]:
        """Detect technologies mentioned in the content"""
        content_lower = content.lower()
        detected = set()
        
        for category, techs in self.technology_patterns.items():
            for tech in techs:
                if tech in content_lower:
                    detected.add(tech)
        
        return sorted(list(detected))
    
    def _detect_categories(self, content: str, technologies: List[str]) -> List[str]:
        """Detect categories based on content and technologies"""
        content_lower = content.lower()
        detected = set()
        
        # Check category patterns
        for category, patterns in self.category_patterns.items():
            for pattern in patterns:
                if pattern in content_lower:
                    detected.add(category)
        
        # Check technology-based categories
        if any(tech in technologies for tech in ['react', 'vue', 'angular', 'svelte', 'nextjs']):
            detected.add('frontend_framework')
        if any(tech in technologies for tech in ['nodejs', 'express', 'fastapi', 'django']):
            detected.add('backend_framework')
        if any(tech in technologies for tech in ['react-native', 'flutter', 'expo']):
            detected.add('mobile_development')
        if any(tech in technologies for tech in ['jest', 'cypress', 'playwright']):
            detected.add('testing_framework')
        
        return sorted(list(detected))
    
    def _determine_complexity(self, content: str) -> str:
        """Determine the complexity level of the rule file"""
        lines = content.split('\n')
        word_count = len(content.split())
        
        if word_count < 200 or len(lines) < 20:
            return 'simple'
        elif word_count < 500 or len(lines) < 50:
            return 'medium'
        else:
            return 'complex'
    
    def _extract_focus_areas(self, content: str) -> List[str]:
        """Extract focus areas from the content"""
        focus_areas = []
        content_lower = content.lower()
        
        focus_patterns = {
            'performance': ['performance', 'optimize', 'fast', 'speed', 'efficient'],
            'security': ['security', 'secure', 'auth', 'authentication', 'authorization'],
            'testing': ['test', 'testing', 'coverage', 'quality', 'validation'],
            'accessibility': ['accessibility', 'a11y', 'aria', 'screen reader'],
            'seo': ['seo', 'search engine', 'meta', 'semantic'],
            'responsive': ['responsive', 'mobile', 'desktop', 'breakpoint'],
            'api_design': ['api', 'rest', 'graphql', 'endpoint', 'route'],
            'state_management': ['state', 'redux', 'mobx', 'context', 'store'],
            'error_handling': ['error', 'exception', 'try', 'catch', 'handling'],
            'code_quality': ['clean', 'maintainable', 'readable', 'best practice']
        }
        
        for area, patterns in focus_patterns.items():
            if any(pattern in content_lower for pattern in patterns):
                focus_areas.append(area)
        
        return sorted(focus_areas)
    
    def _extract_dependencies(self, content: str) -> List[str]:
        """Extract mentioned dependencies and libraries"""
        dependencies = set()
        
        # Look for common dependency patterns
        dep_patterns = [
            r'@?[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+',  # scoped packages
            r'[a-zA-Z0-9_-]+@[0-9]+\.[0-9]+',    # versioned packages
            r'from [\'"]([a-zA-Z0-9_-]+)[\'"]',   # import statements
            r'import [\'"]([a-zA-Z0-9_-]+)[\'"]'  # import statements
        ]
        
        for pattern in dep_patterns:
            matches = re.findall(pattern, content)
            dependencies.update(matches)
        
        return sorted(list(dependencies))[:10]  # Limit to top 10
    
    def _extract_patterns(self, content: str) -> List[str]:
        """Extract architectural and design patterns mentioned"""
        patterns = set()
        content_lower = content.lower()
        
        pattern_keywords = [
            'mvc', 'mvp', 'mvvm', 'singleton', 'factory', 'observer', 'decorator',
            'adapter', 'facade', 'strategy', 'repository', 'service', 'component',
            'hook', 'middleware', 'interceptor', 'decorator', 'builder', 'command'
        ]
        
        for pattern in pattern_keywords:
            if pattern in content_lower:
                patterns.add(pattern)
        
        return sorted(list(patterns))
    
    def _generate_description(self, content: str, technologies: List[str], categories: List[str]) -> str:
        """Generate a description based on content analysis"""
        # Extract first meaningful sentence
        sentences = content.split('.')
        first_sentence = sentences[0].strip() if sentences else ""
        
        if len(first_sentence) > 100:
            first_sentence = first_sentence[:100] + "..."
        
        tech_str = ", ".join(technologies[:5]) if technologies else "various technologies"
        cat_str = ", ".join(categories[:3]) if categories else "general development"
        
        return f"Cursor rules for {tech_str} development focusing on {cat_str}. {first_sentence}"
    
    def _extract_keywords(self, content: str) -> List[str]:
        """Extract important keywords from the content"""
        # Remove common stop words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
            'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
            'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
            'us', 'them', 'use', 'using', 'used', 'all', 'any', 'some', 'each', 'every'
        }
        
        # Extract words
        words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
        word_counts = Counter(words)
        
        # Filter out stop words and get top keywords
        keywords = [word for word, count in word_counts.most_common(20) 
                   if word not in stop_words and count > 1]
        
        return keywords[:15]
    
    def analyze_all_rules(self) -> List[RuleMetadata]:
        """Analyze all .cursorrules files in the directory"""
        print(f"Analyzing rules in {self.rules_dir}")
        
        rule_files = list(self.rules_dir.glob("**/.cursorrules"))
        print(f"Found {len(rule_files)} rule files")
        
        for file_path in rule_files:
            print(f"Analyzing {file_path.name}...")
            metadata = self.analyze_rule_file(file_path)
            if metadata:
                self.rules.append(metadata)
        
        return self.rules
    
    def generate_categories_report(self) -> Dict:
        """Generate a comprehensive categories report"""
        if not self.rules:
            self.analyze_all_rules()
        
        report = {
            'total_rules': len(self.rules),
            'categories': defaultdict(list),
            'technologies': defaultdict(list),
            'complexity_distribution': Counter(),
            'focus_areas': defaultdict(list),
            'patterns': defaultdict(list)
        }
        
        for rule in self.rules:
            # Categorize by categories
            for category in rule.categories:
                report['categories'][category].append(rule.name)
            
            # Categorize by technologies
            for tech in rule.technologies:
                report['technologies'][tech].append(rule.name)
            
            # Track complexity
            report['complexity_distribution'][rule.complexity] += 1
            
            # Track focus areas
            for focus in rule.focus_areas:
                report['focus_areas'][focus].append(rule.name)
            
            # Track patterns
            for pattern in rule.patterns:
                report['patterns'][pattern].append(rule.name)
        
        return dict(report)
    
    def save_analysis(self, output_file: str):
        """Save the analysis results to a JSON file"""
        analysis_data = {
            'rules': [asdict(rule) for rule in self.rules],
            'report': self.generate_categories_report(),
            'metadata': {
                'total_rules': len(self.rules),
                'analysis_date': str(Path().cwd()),
                'rules_directory': str(self.rules_dir)
            }
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, indent=2, ensure_ascii=False)
        
        print(f"Analysis saved to {output_file}")

def main():
    """Main function to run the rule analyzer"""
    rules_dir = "/Users/jesse/JesseRod329.github.io/mdmatch/awesome-cursorrules-main/rules"
    analyzer = RuleAnalyzer(rules_dir)
    
    # Analyze all rules
    rules = analyzer.analyze_all_rules()
    
    # Generate and print report
    report = analyzer.generate_categories_report()
    
    print("\n" + "="*50)
    print("RULE ANALYSIS REPORT")
    print("="*50)
    
    print(f"\nTotal Rules Analyzed: {report['total_rules']}")
    
    print(f"\nComplexity Distribution:")
    for complexity, count in report['complexity_distribution'].items():
        print(f"  {complexity}: {count}")
    
    print(f"\nTop Categories:")
    for category, rules_list in sorted(report['categories'].items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        print(f"  {category}: {len(rules_list)} rules")
    
    print(f"\nTop Technologies:")
    for tech, rules_list in sorted(report['technologies'].items(), key=lambda x: len(x[1]), reverse=True)[:15]:
        print(f"  {tech}: {len(rules_list)} rules")
    
    print(f"\nTop Focus Areas:")
    for focus, rules_list in sorted(report['focus_areas'].items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        print(f"  {focus}: {len(rules_list)} rules")
    
    # Save analysis
    analyzer.save_analysis("rule_analysis.json")
    
    return analyzer

if __name__ == "__main__":
    analyzer = main()
