const state = {
  query: '',
  author: 'all',
};

let allCases = [];

function createElement(tag, className, textContent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof textContent === 'string' && textContent.length) {
    el.textContent = textContent;
  }
  return el;
}

function createLink(url, label) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.textContent = label;
  return anchor;
}

function trimMultiline(text) {
  return typeof text === 'string' ? text.trim() : '';
}

function renderSources(sources = []) {
  if (!sources.length) return null;

  const wrapper = createElement('div', 'source-list');
  const title = createElement('div', 'section-title', 'Sources');
  const list = createElement('ul');

  sources.forEach((item, index) => {
    const url = item?.url;
    if (!url) return;

    const li = document.createElement('li');
    li.appendChild(createLink(url, item.title || `Link ${index + 1}`));
    list.appendChild(li);
  });

  if (!list.children.length) return null;

  wrapper.append(title, list);
  return wrapper;
}

function renderCard(entry) {
  const card = createElement('article', 'card');

  if (entry.image) {
    const figure = createElement('figure', 'preview');
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = entry.image;
    img.alt = entry.alt || entry.title || `Case ${entry.id}`;
    figure.appendChild(img);
    card.appendChild(figure);
  }

  const header = createElement('header', 'card-header');
  const title = createElement('h2', null, entry.title || `Case ${entry.id}`);
  const tag = createElement('span', 'tag', `Case ${entry.id}`);
  title.appendChild(tag);

  if (entry.titleOriginal && entry.titleOriginal !== entry.title) {
    const subtitle = createElement('div', 'subtitle', entry.titleOriginal);
    header.append(title, subtitle);
  } else {
    header.append(title);
  }

  const meta = createElement('div', 'meta');
  if (entry.author) {
    const author = createElement('span');
    author.textContent = 'By ';
    if (entry.authorLink) {
      author.appendChild(createLink(entry.authorLink, entry.author));
    } else {
      author.append(entry.author);
    }
    meta.appendChild(author);
  }

  if (meta.children.length) {
    header.appendChild(meta);
  }

  card.appendChild(header);

  const sourceLinks = renderSources(entry.sourceLinks);
  if (sourceLinks) {
    card.appendChild(sourceLinks);
  }

  const promptSection = createElement('section');
  promptSection.append(
    createElement('div', 'section-title', 'Prompt'),
    createElement('pre', 'prompt-text', trimMultiline(entry.prompt))
  );
  card.appendChild(promptSection);

  const originalPrompt = trimMultiline(entry.promptOriginal);
  if (originalPrompt && originalPrompt !== trimMultiline(entry.prompt)) {
    const originalSection = createElement('section');
    originalSection.append(
      createElement('div', 'section-title', 'Original Prompt'),
      createElement('pre', 'prompt-text', originalPrompt)
    );
    card.appendChild(originalSection);
  }

  const reference = trimMultiline(entry.referenceNote);
  if (reference) {
    const referenceSection = createElement('section');
    referenceSection.append(
      createElement('div', 'section-title', 'Reference'),
      createElement('p', 'requirement', reference)
    );
    card.appendChild(referenceSection);
  }

  const note = trimMultiline(entry.promptNote);
  if (note) {
    const noteBlock = createElement('div', 'note', note);
    card.appendChild(noteBlock);
  }

  return card;
}

async function loadCases() {
  const response = await fetch('./cases.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load cases.json: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data?.cases) ? data.cases : [];
}

function renderCards(container, entries) {
  if (!entries.length) {
    container.innerHTML = '<p class="status">No prompt cases match the current filters.</p>';
    return;
  }

  container.innerHTML = '';
  entries.forEach((entry) => container.appendChild(renderCard(entry)));
}

function normalize(value) {
  return typeof value === 'string' ? value.toLowerCase() : '';
}

function matchesQuery(entry, query) {
  if (!query) return true;
  const needle = query.toLowerCase();
  const haystack = [
    entry.title,
    entry.titleOriginal,
    entry.prompt,
    entry.promptOriginal,
    entry.promptNote,
    entry.referenceNote,
    entry.author,
  ];

  return haystack.some((value) => normalize(value).includes(needle));
}

function matchesAuthor(entry, author) {
  if (author === 'all') return true;
  const authorValue = entry.author?.toLowerCase() ?? '';
  return authorValue === author.toLowerCase();
}

function applyFilters(container) {
  const results = allCases.filter(
    (entry) => matchesQuery(entry, state.query) && matchesAuthor(entry, state.author)
  );
  renderCards(container, results);
}

function populateAuthorFilter(select, entries) {
  const authors = Array.from(
    new Set(
      entries
        .map((entry) => entry.author?.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  authors.forEach((author) => {
    const option = document.createElement('option');
    option.value = author;
    option.textContent = author;
    select.appendChild(option);
  });
}

async function init() {
  const grid = document.querySelector('.cards');
  const searchInput = document.getElementById('promptSearch');
  const authorSelect = document.getElementById('authorFilter');
  if (!grid) return;

  grid.innerHTML = '<p class="status">Loading prompt library…</p>';

  try {
    allCases = await loadCases();
    if (!allCases.length) {
      grid.innerHTML = '<p class="status">No prompt cases available yet.</p>';
      return;
    }

    if (authorSelect) {
      populateAuthorFilter(authorSelect, allCases);
      authorSelect.addEventListener('change', (event) => {
        state.author = event.target.value;
        applyFilters(grid);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        state.query = event.target.value.trim();
        applyFilters(grid);
      });
    }

    applyFilters(grid);
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="status error">Unable to load prompt data right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
