import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = new URL('..', import.meta.url);
const CASES_DIR = path.join(ROOT.pathname, 'prompt', 'awesome-nano-banana-main', 'cases');
const OUTPUT_FILE = path.join(ROOT.pathname, 'prompt', 'cases.json');

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function readCaseFolder(dirent) {
  if (!dirent.isDirectory()) return null;

  const caseId = Number(dirent.name);
  if (Number.isNaN(caseId)) return null;

  const casePath = path.join(CASES_DIR, dirent.name, 'case.yml');
  if (!(await fileExists(casePath))) return null;

  const raw = await fs.readFile(casePath, 'utf8');
  const data = yaml.load(raw) ?? {};

  const sourceLinks = ensureArray(data.source_links).map((link) =>
    typeof link === 'string' ? { url: link } : link
  );

  const entry = {
    id: caseId,
    title: data.title_en || data.title || `Case ${caseId}`,
    titleOriginal: data.title || null,
    author: data.author || null,
    authorLink: data.author_link || null,
    sourceLinks,
    prompt: data.prompt_en || data.prompt || '',
    promptOriginal: data.prompt || null,
    promptNote: data.prompt_note_en || data.prompt_note || null,
    referenceNote: data.reference_note_en || data.reference_note || null,
    image: data.image
      ? path.posix.join('.', 'awesome-nano-banana-main', 'cases', dirent.name, data.image)
      : null,
    alt: data.alt_text_en || data.alt_text || null,
  };

  return entry;
}

async function main() {
  const dirents = await fs.readdir(CASES_DIR, { withFileTypes: true });
  const entries = (await Promise.all(dirents.map(readCaseFolder)))
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);

  const output = {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    cases: entries,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Generated ${entries.length} cases into ${path.relative(ROOT.pathname, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
