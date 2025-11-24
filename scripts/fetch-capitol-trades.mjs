#!/usr/bin/env node
/**
 * Scrape the public trades table from https://www.capitoltrades.com/trades
 * and save the full dataset as newline-delimited JSON.
 *
 * Usage:
 *   node scripts/fetch-capitol-trades.mjs
 *     --output data/capitol-trades/trades.jsonl
 *     --summary data/capitol-trades/summary.json
 *     --concurrency 5
 *     --start-page 1
 *     --max-pages 100   # optional limit for testing
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { finished } from 'node:stream/promises';
import { parseArgs } from 'node:util';
import { load } from 'cheerio';

const BASE_URL = 'https://www.capitoltrades.com';
const DEFAULT_OUTPUT = path.resolve('data/capitol-trades/trades.jsonl');
const DEFAULT_SUMMARY = path.resolve('data/capitol-trades/summary.json');
const DEFAULT_CONCURRENCY = 5;
const MAX_RETRIES = 5;
const scrapedAt = new Date().toISOString();

const args = parseArgs({
  options: {
    output: { type: 'string' },
    summary: { type: 'string' },
    concurrency: { type: 'string', short: 'c' },
    'max-pages': { type: 'string' },
    'start-page': { type: 'string' },
    'user-agent': { type: 'string' }
  }
});

const options = {
  output: path.resolve(args.values.output ?? DEFAULT_OUTPUT),
  summary: path.resolve(args.values.summary ?? DEFAULT_SUMMARY),
  concurrency: Math.max(1, Number(args.values.concurrency ?? DEFAULT_CONCURRENCY)),
  startPage: Math.max(1, Number(args.values['start-page'] ?? 1)),
  maxPages: args.values['max-pages'] ? Math.max(1, Number(args.values['max-pages'])) : null,
  userAgent:
    args.values['user-agent'] ??
    'Mozilla/5.0 (compatible; CapitolTradesScraper/1.0; +https://github.com/JesseRod329)'
};

/** Simple helper to pause execution */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uniquePoliticians = new Set();
const uniqueIssuers = new Set();
let totalRecords = 0;
let totalPagesDiscovered = null;
const siteDigestStats = {
  trades: null,
  filings: null,
  volume: null,
  politicians: null,
  issuers: null
};

const pageBuffers = new Map();
let nextPageToWrite = options.startPage;

await fsp.mkdir(path.dirname(options.output), { recursive: true });
await fsp.mkdir(path.dirname(options.summary), { recursive: true });
const writer = fs.createWriteStream(options.output, { flags: 'w' });

function log(message, extra = '') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${message}${extra ? ` ${extra}` : ''}`);
}

async function fetchPageHtml(page) {
  const url = `${BASE_URL}/trades?page=${page}`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent': options.userAgent,
          accept: 'text/html,application/xhtml+xml'
        },
        cache: 'no-store',
        redirect: 'follow'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const text = await res.text();
      if (text.includes('Page Not Found') && !text.includes('data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"')) {
        throw new Error('Received fallback error page');
      }
      return text;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to fetch page ${page}: ${error.message}`);
      }
      await sleep(500 * attempt);
    }
  }
  throw new Error(`Unreachable fetch failure for page ${page}`);
}

function textOrNull(element) {
  const value = element?.text()?.trim();
  return value && value.length > 0 ? value : null;
}

function slugFromPath(href) {
  if (!href) return null;
  const parts = href.split('/').filter(Boolean);
  return parts.at(-1) ?? null;
}

function absoluteUrl(href) {
  if (!href) return null;
  try {
    return new URL(href, BASE_URL).href;
  } catch {
    return null;
  }
}

function parseNumber(text) {
  if (!text) return null;
  const cleaned = text.replace(/[$,\s]/g, '');
  if (!cleaned) return null;
  if (cleaned.endsWith('B')) {
    const value = Number.parseFloat(cleaned.slice(0, -1));
    return Number.isFinite(value) ? value * 1e9 : null;
  }
  if (cleaned.endsWith('M')) {
    const value = Number.parseFloat(cleaned.slice(0, -1));
    return Number.isFinite(value) ? value * 1e6 : null;
  }
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parsePage(html, pageNumber) {
  const $ = load(html);

  const table = $('table').first();
  if (!table.length) {
    throw new Error('No trades table found in page response');
  }

  const rows = [];
  table.find('tbody tr').each((_, tr) => {
    const row = $(tr);
    const tds = row.children('td');

    const politicianCell = row.find('.cell--politician').first();
    const politicianLink = politicianCell.find('h2 a').first();
    const politician = {
      name: textOrNull(politicianLink),
      slug: slugFromPath(politicianLink.attr('href')),
      url: absoluteUrl(politicianLink.attr('href')),
      party: textOrNull(politicianCell.find('.q-field.party')),
      chamber: textOrNull(politicianCell.find('.q-field.chamber')),
      state: textOrNull(politicianCell.find('.q-field.us-state-compact'))
    };

    const issuerCell = row.find('.cell--traded-issuer').first();
    const issuerLink = issuerCell.find('.issuer-name a').first();
    const issuer = {
      name: textOrNull(issuerLink),
      slug: slugFromPath(issuerLink.attr('href')),
      url: absoluteUrl(issuerLink.attr('href')),
      ticker: textOrNull(issuerCell.find('.issuer-ticker'))
    };

    const publishedCell = tds.eq(2);
    const tradedCell = tds.eq(3);
    const gapCell = tds.eq(4);
    const ownerCell = tds.eq(5);
    const typeCell = tds.eq(6);
    const sizeCell = tds.eq(7);
    const priceCell = tds.eq(8);
    const linkCell = row.find('a[href^="/trades/"]').first();

    const publishedTime = textOrNull(publishedCell.find('.text-size-3').first());
    const publishedLabel = textOrNull(publishedCell.find('.text-size-2').first());
    const tradeDay = textOrNull(tradedCell.find('.text-size-3').first());
    const tradeYear = textOrNull(tradedCell.find('.text-size-2').first());
    const tradeDateDisplay = [tradeDay, tradeYear].filter(Boolean).join(' ').trim() || null;
    const gapText = textOrNull(gapCell.find('.q-value span'));
    const owner = textOrNull(ownerCell.find('.q-label'));
    const ownerVariantMatch =
      ownerCell.find('.q-field').attr('class')?.match(/owner-with-icon--([a-z-]+)/i);
    const transactionTypeRaw = textOrNull(typeCell.find('.tx-type'));
    const transactionType = transactionTypeRaw?.replace(/\*/g, '').trim() || null;
    const tradeSize =
      textOrNull(sizeCell.find('.q-field.trade-size span.mt-1')) ||
      textOrNull(sizeCell.find('.q-field.trade-size')) ||
      null;
    const priceValueRaw = textOrNull(priceCell.find('span').first());
    const price =
      priceValueRaw && priceValueRaw !== '—'
        ? Number.parseFloat(priceValueRaw.replace(/[$,]/g, ''))
        : null;
    const detailUrl = absoluteUrl(linkCell.attr('href'));

    rows.push({
      page: pageNumber,
      scrapedAt,
      detailUrl,
      published: {
        time: publishedTime,
        label: publishedLabel
      },
      tradeDate: {
        display: tradeDateDisplay,
        day: tradeDay,
        year: tradeYear
      },
      reportingGapDays: gapText ? Number.parseInt(gapText, 10) : null,
      owner,
      ownerCategory: ownerVariantMatch ? ownerVariantMatch[1] : null,
      transactionType,
      tradeSize,
      price,
      politician,
      issuer
    });
  });

  if (rows.length === 0) {
    throw new Error('No trades parsed from page response');
  }

  let totalPages = null;
  const lastHref = $('a[aria-label="Go to last page"]').attr('href');
  if (lastHref) {
    const params = new URLSearchParams(lastHref.split('?')[1]);
    totalPages = Number.parseInt(params.get('page') ?? '', 10) || null;
  } else {
    const pageText = $('div.relative').find('p').first().text();
    const parts = pageText.match(/\d+/g);
    if (parts && parts.length >= 2) {
      totalPages = Number.parseInt(parts[1], 10) || null;
    }
  }

  const digestStats = { ...siteDigestStats };
  const digestCards = $('.grid')
    .filter((_, el) => $(el).find('.digest-icon-wrapper').length > 0)
    .first()
    .find('.flex.items-center.justify-between');

  if (digestCards.length) {
    digestCards.each((_, card) => {
      const label = textOrNull($(card).find('.text-size-2'))?.toLowerCase();
      const valueText = textOrNull($(card).find('.text-size-5'));
      if (!label || !valueText) return;
      switch (label) {
        case 'trades':
          digestStats.trades = Number.parseInt(valueText.replace(/,/g, ''), 10);
          break;
        case 'filings':
          digestStats.filings = Number.parseInt(valueText.replace(/,/g, ''), 10);
          break;
        case 'volume':
          digestStats.volume = parseNumber(valueText);
          break;
        case 'politicians':
          digestStats.politicians = Number.parseInt(valueText.replace(/,/g, ''), 10);
          break;
        case 'issuers':
          digestStats.issuers = Number.parseInt(valueText.replace(/,/g, ''), 10);
          break;
        default:
          break;
      }
    });
  }

  return { rows, totalPages, digestStats };
}

function registerRows(rows) {
  const lines = [];
  for (const row of rows) {
    if (row.politician?.slug) uniquePoliticians.add(row.politician.slug);
    if (row.issuer?.slug) uniqueIssuers.add(row.issuer.slug);
    totalRecords += 1;
    lines.push(JSON.stringify(row));
  }
  return lines;
}

function flushReadyPages() {
  while (pageBuffers.has(nextPageToWrite)) {
    const lines = pageBuffers.get(nextPageToWrite);
    pageBuffers.delete(nextPageToWrite);
    for (const line of lines) {
      writer.write(line + os.EOL);
    }
    nextPageToWrite += 1;
  }
}

async function scrapePage(page) {
  const html = await fetchPageHtml(page);
  const { rows, totalPages, digestStats } = parsePage(html, page);

  if (!totalPagesDiscovered && totalPages) {
    totalPagesDiscovered = totalPages;
  }

  if (
    !siteDigestStats.trades &&
    digestStats &&
    Object.values(digestStats).some((value) => value !== null)
  ) {
    Object.assign(siteDigestStats, digestStats);
  }

  const lines = registerRows(rows);
  pageBuffers.set(page, lines);
  flushReadyPages();
  log(`Page ${page} processed`, `(${rows.length} trades)`);
}

async function runWithConcurrency(pages, limit, worker) {
  const queue = new Set();

  for (const page of pages) {
    const task = worker(page)
      .catch((error) => {
        log(`Error scraping page ${page}: ${error.message}`);
        throw error;
      })
      .finally(() => queue.delete(task));

    queue.add(task);
    if (queue.size >= limit) {
      await Promise.race(queue);
    }
  }

  await Promise.allSettled(queue);
}

async function main() {
  log(
    `Starting Capitol Trades scrape (concurrency=${options.concurrency}, start=${options.startPage}${
      options.maxPages ? `, maxPages=${options.maxPages}` : ''
    })`
  );

  // Fetch first page sequentially to discover pagination metadata.
  await scrapePage(options.startPage);

  const totalPages =
    totalPagesDiscovered ?? (options.maxPages ? options.startPage + options.maxPages - 1 : options.startPage);
  const maxPage = options.maxPages
    ? Math.min(options.startPage + options.maxPages - 1, totalPages)
    : totalPages;

  const remainingPages = [];
  for (let page = options.startPage + 1; page <= maxPage; page += 1) {
    remainingPages.push(page);
  }

  await runWithConcurrency(remainingPages, options.concurrency, scrapePage);

  writer.end();
  await finished(writer);

  const summary = {
    scrapedAt,
    source: `${BASE_URL}/trades`,
    output: path.relative(process.cwd(), options.output),
    totalRecords,
    uniquePoliticians: uniquePoliticians.size,
    uniqueIssuers: uniqueIssuers.size,
    pagesFetched: maxPage - options.startPage + 1,
    pageRange: { start: options.startPage, end: maxPage },
    siteDigestStats
  };

  await fsp.writeFile(options.summary, JSON.stringify(summary, null, 2));
  log('Scrape completed', `(records=${totalRecords}, file=${summary.output})`);
}

main().catch(async (error) => {
  console.error(error);
  writer.destroy(error);
  process.exitCode = 1;
});



