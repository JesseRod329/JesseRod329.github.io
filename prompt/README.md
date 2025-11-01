# Prompt Library Update Guide

This directory contains the prompt library for [jesserodriguez.me/prompt/](https://jesserodriguez.me/prompt/), which displays Nano Banana prompt recipes from the Awesome Nano Banana Images archive.

## Structure

- `awesome-nano-banana-main/` - Contains the forked/copied repository with case YAML files
- `cases.json` - Generated JSON file that powers the prompt library page
- `generate-cases.js` - Script to parse YAML files and generate cases.json
- `sync-upstream.sh` - Script to sync with upstream repository

## Updating Prompts

### Option 1: Update from Upstream Repository

If you want to pull the latest cases from the upstream [awesome-nano-banana](https://github.com/JimmyLv/awesome-nano-banana) repository:

```bash
cd prompt
./sync-upstream.sh
```

This will:
1. Fetch latest changes from upstream
2. Merge them into your local awesome-nano-banana-main directory
3. Regenerate cases.json automatically

### Option 2: Add New Cases Manually

1. Add new case directories to `awesome-nano-banana-main/cases/` following the existing structure:
   - Each case should have a numbered directory (e.g., `101/`)
   - Include `case.yml` and `ATTRIBUTION.yml` files
   - Include the example image file

2. Regenerate cases.json:
   ```bash
   cd prompt
   node generate-cases.js
   ```

### Option 3: Manual cases.json Update

If you prefer to edit `cases.json` directly, make sure it follows this structure:

```json
{
  "generatedAt": "ISO timestamp",
  "total": 100,
  "cases": [
    {
      "id": 1,
      "title": "Case Title",
      "titleOriginal": "Original Title (if different)",
      "author": "@author",
      "authorLink": "https://x.com/author",
      "sourceLinks": [{"url": "https://..."}],
      "prompt": "The prompt text...",
      "promptOriginal": "Original prompt...",
      "promptNote": "Optional note",
      "referenceNote": "Reference requirements",
      "image": "path/to/image.png",
      "alt": "Alt text"
    }
  ]
}
```

## Testing

After updating cases.json, you can test the prompt library locally:

1. Open `index.html` in your browser
2. Verify all cases load correctly
3. Test search and filtering functionality
4. Check that images display properly

## Notes

- The `cases.json` file is generated from YAML files, so it's recommended to keep the YAML files up to date and regenerate JSON rather than editing JSON directly
- Images should be referenced relative to the prompt directory root
- All fields except `id` and `title` are optional in the JSON output

