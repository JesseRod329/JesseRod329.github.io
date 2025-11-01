#!/usr/bin/env node

/**
 * Scrape prompts from nanobananaprompt.org/prompts/
 * Extracts prompts, images, and metadata and adds them to cases.json
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PROMPTS_URL = 'https://nanobananaprompt.org/prompts/';
const CASES_JSON_PATH = path.join(__dirname, 'cases.json');

function generateTitle(prompt, maxLength = 60) {
  if (!prompt) return 'Untitled Prompt';
  const trimmed = prompt.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.substring(0, maxLength).trim() + '...';
}

function normalizePrompt(prompt) {
  if (!prompt) return '';
  // Remove common UI text that might be scraped
  let cleaned = prompt.trim()
    .replace(/\s*Edit Image Copy\s*/gi, '')
    .replace(/\s*Copy\s*/gi, '')
    .replace(/\s*Edit Image\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function isLikelyPrompt(text) {
  if (!text || text.length < 20) return false;
  
  // Filter out common non-prompt patterns
  const excludePatterns = [
    /^http/i,
    /^www\./i,
    /@\w+$/i, // Just Twitter handles without context
    /^\d+$/i, // Just numbers
    /^[A-Z\s]{3,}$/, // All caps short strings (likely headers)
    /tools? directory/i,
    /featured on/i,
    /all rights reserved/i,
    /privacy policy/i,
    /terms of service/i,
    /cookie/i,
    /click here/i,
    /subscribe/i,
    /newsletter/i,
    /^free image to prompt/i, // Footer links
    /^[a-z\s]+ai$/i, // Just "something AI" without context
  ];
  
  for (const pattern of excludePatterns) {
    if (pattern.test(text)) return false;
  }
  
  // Look for prompt-like patterns
  const promptKeywords = [
    'transform', 'create', 'generate', 'make', 'turn', 'add', 'replace', 
    'change', 'edit', 'convert', 'modify', 'into', 'with', 'portrait',
    'photo', 'image', 'style', 'background', 'character', 'figure'
  ];
  
  const lowerText = text.toLowerCase();
  const hasPromptKeywords = promptKeywords.some(keyword => lowerText.includes(keyword));
  
  // Must have prompt keywords or be reasonably long descriptive text
  return hasPromptKeywords || (text.length > 50 && !lowerText.includes('directory'));
}

function extractPromptsFromHtml(html) {
  const $ = cheerio.load(html);
  const prompts = [];
  const seenPrompts = new Set();

  // Strategy 1: Look for prompt cards/containers - common patterns
  const cardSelectors = [
    'article',
    '[class*="card"]',
    '[class*="prompt"]',
    '[class*="gallery"] > *',
    '.grid > *',
    '[class*="item"]'
  ];

  for (const selector of cardSelectors) {
    $(selector).each((index, element) => {
      const $el = $(element);
      
      // Get all text content
      const allText = $el.text().trim();
      if (allText.length < 20) return;

      // Find images in this element or nearby
      let imageUrl = null;
      const img = $el.find('img').first();
      if (img.length) {
        imageUrl = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('data-original');
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          imageUrl = new URL(imageUrl, PROMPTS_URL).href;
        }
      }
      
      // If no image in element, check parent
      if (!imageUrl) {
        const $parent = $el.parent();
        const parentImg = $parent.find('img').first();
        if (parentImg.length) {
          imageUrl = parentImg.attr('src') || parentImg.attr('data-src') || parentImg.attr('data-lazy-src');
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = new URL(imageUrl, PROMPTS_URL).href;
          }
        }
      }

      // Extract prompt text - prefer longer text blocks
      let promptText = '';
      const textElements = $el.find('p, div, span, pre, code').toArray();
      
      // Find the longest meaningful text block
      let maxLength = 0;
      for (const textEl of textElements) {
        const text = $(textEl).text().trim();
        const cleaned = normalizePrompt(text);
        if (cleaned.length > maxLength && cleaned.length > 20) {
          promptText = cleaned;
          maxLength = cleaned.length;
        }
      }

      // If no good text found in children, use the element's direct text
      if (!promptText || promptText.length < 20) {
        promptText = normalizePrompt(allText);
      }

      // Skip if too short, invalid, or not likely a prompt
      if (promptText.length < 10) return;
      if (!isValidImageUrl(imageUrl)) return;
      if (!isLikelyPrompt(promptText)) return;

      // Create a hash to check duplicates
      const promptHash = promptText.substring(0, 100).toLowerCase().trim();
      if (seenPrompts.has(promptHash)) return;
      seenPrompts.add(promptHash);

      prompts.push({
        prompt: promptText,
        image: imageUrl,
        category: null,
        author: null,
      });
    });
  }

  // Strategy 2: Look for patterns in the HTML structure
  // Find all images and their associated text
  $('img').each((index, imgElement) => {
    const $img = $(imgElement);
    let imageUrl = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
    
    if (!imageUrl || imageUrl.startsWith('data:')) return;
    if (!imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, PROMPTS_URL).href;
    }
    if (!isValidImageUrl(imageUrl)) return;

    // Look for prompt text nearby (siblings, parent, or next elements)
    let promptText = '';
    const $parent = $img.parent();
    
    // Check siblings
    $parent.siblings().each((i, sibling) => {
      const text = $(sibling).text().trim();
      const cleaned = normalizePrompt(text);
      if (cleaned.length > promptText.length && cleaned.length > 20) {
        promptText = cleaned;
      }
    });

    // Check parent's text
    const parentText = $parent.text().trim();
    const cleanedParent = normalizePrompt(parentText);
    if (cleanedParent.length > promptText.length && cleanedParent.length > 20) {
      promptText = cleanedParent;
    }

    // Check next element
    const $next = $img.next();
    if ($next.length) {
      const nextText = normalizePrompt($next.text().trim());
      if (nextText.length > promptText.length && nextText.length > 20) {
        promptText = nextText;
      }
    }

    if (promptText.length < 10) return;
    if (!isLikelyPrompt(promptText)) return;

    const promptHash = promptText.substring(0, 100).toLowerCase().trim();
    if (seenPrompts.has(promptHash)) return;
    seenPrompts.add(promptHash);

    prompts.push({
      prompt: promptText,
      image: imageUrl,
      category: null,
      author: null,
    });
  });

  return prompts;
}

async function scrapePrompts() {
  console.log('🔍 Fetching prompts from nanobananaprompt.org/prompts/...');
  
  try {
    const response = await fetch(PROMPTS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log(`✅ Fetched ${html.length} bytes of HTML`);

    const prompts = extractPromptsFromHtml(html);
    console.log(`📝 Extracted ${prompts.length} prompts`);

    return prompts;
  } catch (error) {
    console.error('❌ Error scraping prompts:', error.message);
    throw error;
  }
}

function loadExistingCases() {
  try {
    const content = fs.readFileSync(CASES_JSON_PATH, 'utf8');
    const data = JSON.parse(content);
    return data.cases || [];
  } catch (error) {
    console.error('Error loading existing cases:', error.message);
    return [];
  }
}

function findNextCaseId(existingCases) {
  if (existingCases.length === 0) return 101;
  const maxId = Math.max(...existingCases.map(c => c.id || 0));
  return Math.max(101, maxId + 1);
}

function isDuplicatePrompt(newPrompt, existingCases) {
  const normalizedNew = normalizePrompt(newPrompt).toLowerCase();
  return existingCases.some(caseItem => {
    const normalizedExisting = normalizePrompt(caseItem.prompt || '').toLowerCase();
    if (!normalizedExisting) return false;
    
    // Check for exact match or significant overlap
    if (normalizedNew === normalizedExisting) return true;
    if (normalizedNew.length > 50 && normalizedExisting.length > 50) {
      const similarity = normalizedNew.substring(0, 50) === normalizedExisting.substring(0, 50);
      if (similarity) return true;
    }
    
    return false;
  });
}

function mergePrompts(scrapedPrompts, existingCases) {
  const newCases = [];
  let nextId = findNextCaseId(existingCases);
  
  for (const scraped of scrapedPrompts) {
    // Skip duplicates
    if (isDuplicatePrompt(scraped.prompt, existingCases)) {
      continue;
    }
    
    // Skip if already in new cases
    if (isDuplicatePrompt(scraped.prompt, newCases)) {
      continue;
    }

    const title = generateTitle(scraped.prompt);
    const caseItem = {
      id: nextId++,
      title: title,
      prompt: scraped.prompt,
      image: scraped.image,
      alt: title,
      sourceLinks: scraped.image ? [{ url: PROMPTS_URL }] : null,
    };

    if (scraped.author) {
      caseItem.author = scraped.author;
    }

    if (scraped.category) {
      caseItem.referenceNote = `Category: ${scraped.category}`;
    }

    // Remove null values
    Object.keys(caseItem).forEach(key => {
      if (caseItem[key] === null) {
        delete caseItem[key];
      }
    });

    newCases.push(caseItem);
  }

  return newCases;
}

async function main() {
  try {
    console.log('🚀 Starting prompt scraping...\n');

    // Scrape prompts
    const scrapedPrompts = await scrapePrompts();

    if (scrapedPrompts.length === 0) {
      console.log('⚠️  No prompts found. The website structure may have changed.');
      return;
    }

    // Load existing cases
    const existingCases = loadExistingCases();
    console.log(`📚 Loaded ${existingCases.length} existing cases`);

    // Merge and deduplicate
    const newCases = mergePrompts(scrapedPrompts, existingCases);
    console.log(`✨ Found ${newCases.length} new unique prompts`);

    if (newCases.length === 0) {
      console.log('✅ No new prompts to add (all duplicates or already exist)');
      return;
    }

    // Combine with existing cases
    const allCases = [...existingCases, ...newCases];

    // Write updated cases.json
    const output = {
      generatedAt: new Date().toISOString(),
      total: allCases.length,
      cases: allCases
    };

    fs.writeFileSync(CASES_JSON_PATH, JSON.stringify(output, null, 2), 'utf8');

    console.log(`\n✅ Successfully updated cases.json`);
    console.log(`   Total cases: ${output.total} (added ${newCases.length} new)`);
    console.log(`   Output file: ${CASES_JSON_PATH}`);
    console.log(`\n📋 Sample of new prompts:`);
    newCases.slice(0, 3).forEach(c => {
      console.log(`   - Case ${c.id}: ${c.title.substring(0, 60)}...`);
    });

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scrapePrompts, mergePrompts };

