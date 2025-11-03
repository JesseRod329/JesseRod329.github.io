#!/usr/bin/env node

/**
 * Generate cases.json from YAML files in awesome-nano-banana-main/cases/
 * This script parses all case.yml and ATTRIBUTION.yml files and generates
 * a unified cases.json file for the prompt library.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CASES_DIR = path.join(__dirname, 'awesome-nano-banana-main', 'cases');
const OUTPUT_FILE = path.join(__dirname, 'cases.json');

function loadYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

function findImageFile(caseDir) {
  const files = fs.readdirSync(caseDir);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const imageFile = files.find(file => 
    imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
  );
  return imageFile || null;
}

function parseCase(caseNumber) {
  const caseDir = path.join(CASES_DIR, String(caseNumber));
  
  if (!fs.existsSync(caseDir)) {
    return null;
  }

  const caseYmlPath = path.join(caseDir, 'case.yml');
  const attributionYmlPath = path.join(caseDir, 'ATTRIBUTION.yml');

  if (!fs.existsSync(caseYmlPath)) {
    console.warn(`Missing case.yml for case ${caseNumber}`);
    return null;
  }

  const caseData = loadYamlFile(caseYmlPath);
  const attributionData = fs.existsSync(attributionYmlPath) 
    ? loadYamlFile(attributionYmlPath) 
    : null;

  if (!caseData) {
    return null;
  }

  // Find the image file
  const imageFile = caseData.image || findImageFile(caseDir);
  const imagePath = imageFile 
    ? `awesome-nano-banana-main/cases/${caseNumber}/${imageFile}`
    : null;

  // Extract source links
  const sourceLinks = [];
  if (caseData.source_links && Array.isArray(caseData.source_links)) {
    sourceLinks.push(...caseData.source_links.map(link => ({
      url: link.url || link
    })));
  }
  if (attributionData && attributionData.source_links) {
    attributionData.source_links.forEach(link => {
      const url = link.url || link;
      if (!sourceLinks.find(sl => sl.url === url)) {
        sourceLinks.push({ url });
      }
    });
  }

  // Get author info - prefer attribution data, fallback to case data
  const author = attributionData?.prompt_author || caseData.author || '';
  const authorLink = attributionData?.prompt_author_link || caseData.author_link || '';

  // Build the case object
  const caseObj = {
    id: caseNumber,
    title: caseData.title_en || caseData.title || `Case ${caseNumber}`,
    titleOriginal: caseData.title || caseData.title_en || null,
    author: author || null,
    authorLink: authorLink || null,
    sourceLinks: sourceLinks.length > 0 ? sourceLinks : null,
    prompt: (caseData.prompt_en || caseData.prompt || '').trim(),
    promptOriginal: (caseData.prompt || caseData.prompt_en || '').trim() || null,
    promptNote: (caseData.prompt_note_en || caseData.prompt_note || '').trim() || null,
    referenceNote: (caseData.reference_note_en || caseData.reference_note || '').trim() || null,
    image: imagePath,
    alt: caseData.alt_text_en || caseData.alt_text || caseData.title_en || caseData.title || `Case ${caseNumber}`
  };

  // Remove null values for cleaner JSON
  Object.keys(caseObj).forEach(key => {
    if (caseObj[key] === null || caseObj[key] === '') {
      delete caseObj[key];
    }
  });

  return caseObj;
}

function getAllCaseNumbers() {
  const dirs = fs.readdirSync(CASES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const num = parseInt(dirent.name, 10);
      return isNaN(num) ? null : num;
    })
    .filter(num => num !== null)
    .sort((a, b) => a - b);

  return dirs;
}

function generateCasesJson() {
  console.log('Generating cases.json from YAML files...');

  if (!fs.existsSync(CASES_DIR)) {
    console.error(`Cases directory not found: ${CASES_DIR}`);
    process.exit(1);
  }

  const caseNumbers = getAllCaseNumbers();
  console.log(`Found ${caseNumbers.length} case directories`);

  const cases = [];
  let successCount = 0;
  let errorCount = 0;

  for (const caseNumber of caseNumbers) {
    const caseData = parseCase(caseNumber);
    if (caseData) {
      cases.push(caseData);
      successCount++;
    } else {
      errorCount++;
      console.warn(`Failed to parse case ${caseNumber}`);
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    total: cases.length,
    cases: cases.sort((a, b) => a.id - b.id)
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n✅ Successfully generated cases.json`);
  console.log(`   Total cases: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Output file: ${OUTPUT_FILE}`);
}

// Run if called directly
if (require.main === module) {
  try {
    generateCasesJson();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

module.exports = { generateCasesJson, parseCase };


