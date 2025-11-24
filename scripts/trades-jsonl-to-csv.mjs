#!/usr/bin/env node
/**
 * Convert the Capitol Trades JSONL dataset into a flattened CSV file.
 *
 * Usage:
 *   node scripts/trades-jsonl-to-csv.mjs \
 *     --input data/capitol-trades/trades.jsonl \
 *     --output data/capitol-trades/trades.csv
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { finished } from "node:stream/promises";
import { parseArgs } from "node:util";

const DEFAULT_INPUT = path.resolve("data/capitol-trades/trades.jsonl");
const DEFAULT_OUTPUT = path.resolve("data/capitol-trades/trades.csv");

const columns = [
  { header: "page", path: ["page"] },
  { header: "scrapedAt", path: ["scrapedAt"] },
  { header: "detailUrl", path: ["detailUrl"] },
  { header: "published_time", path: ["published", "time"] },
  { header: "published_label", path: ["published", "label"] },
  { header: "tradeDate_display", path: ["tradeDate", "display"] },
  { header: "tradeDate_day", path: ["tradeDate", "day"] },
  { header: "tradeDate_year", path: ["tradeDate", "year"] },
  { header: "reportingGapDays", path: ["reportingGapDays"] },
  { header: "owner", path: ["owner"] },
  { header: "ownerCategory", path: ["ownerCategory"] },
  { header: "transactionType", path: ["transactionType"] },
  { header: "tradeSize", path: ["tradeSize"] },
  { header: "price", path: ["price"] },
  { header: "politician_name", path: ["politician", "name"] },
  { header: "politician_slug", path: ["politician", "slug"] },
  { header: "politician_url", path: ["politician", "url"] },
  { header: "politician_party", path: ["politician", "party"] },
  { header: "politician_chamber", path: ["politician", "chamber"] },
  { header: "politician_state", path: ["politician", "state"] },
  { header: "issuer_name", path: ["issuer", "name"] },
  { header: "issuer_slug", path: ["issuer", "slug"] },
  { header: "issuer_url", path: ["issuer", "url"] },
  { header: "issuer_ticker", path: ["issuer", "ticker"] }
];

const args = parseArgs({
  options: {
    input: { type: "string" },
    output: { type: "string" }
  }
});

const inputPath = path.resolve(args.values.input ?? DEFAULT_INPUT);
const outputPath = path.resolve(args.values.output ?? DEFAULT_OUTPUT);

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value).replace(/\r?\n/g, " ");
  if (/[",]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function getNested(record, fieldPath) {
  return fieldPath.reduce((acc, key) => (acc === undefined || acc === null ? undefined : acc[key]), record);
}

async function ensureInputExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.R_OK);
  } catch (error) {
    console.error(`✖ Input file not found: ${filePath}`);
    process.exitCode = 1;
    process.exit();
  }
}

async function main() {
  await ensureInputExists(inputPath);
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });

  const inputStream = fs.createReadStream(inputPath, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  const writer = fs.createWriteStream(outputPath, { encoding: "utf8" });
  writer.write(columns.map(({ header }) => header).join(",") + "\n");

  let processed = 0;

  try {
    for await (const rawLine of rl) {
      const line = rawLine.trim();
      if (!line) continue;

      let record;
      try {
        record = JSON.parse(line);
      } catch (error) {
        console.warn(`⚠ Skipping invalid JSON line ${processed + 1}: ${error.message}`);
        continue;
      }

      const values = columns.map(({ path }) => {
        const value = getNested(record, path);
        if (value === null || value === undefined) return "";
        if (typeof value === "number") return Number.isFinite(value) ? value : "";
        return value;
      });

      writer.write(values.map(csvEscape).join(",") + "\n");
      processed += 1;
    }

    writer.end();
    await finished(writer);
  } finally {
    rl.close();
  }

  console.log(
    `✓ Converted ${processed} trades to ${path.relative(process.cwd(), outputPath)} from ${path.relative(
      process.cwd(),
      inputPath
    )}`
  );
}

main().catch((error) => {
  console.error("✖ Failed to convert trades JSONL to CSV:", error);
  process.exitCode = 1;
});



