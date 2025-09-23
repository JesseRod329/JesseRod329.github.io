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

const modalElements = {
  root: null,
  dialog: null,
  title: null,
  meta: null,
  prompt: null,
  referenceSection: null,
  referenceText: null,
  sourcesSection: null,
  sourcesList: null,
  imageFigure: null,
  image: null,
  focusTrigger: null,
  closeButtons: [],
  initialized: false,
};

function clearChildren(node) {
  if (!node) return;
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function populateModalSources(listEl, sources = []) {
  if (!listEl) return 0;
  clearChildren(listEl);
  let count = 0;
  sources.forEach((item, index) => {
    const url = item?.url;
    if (!url) return;
    const li = document.createElement('li');
    li.appendChild(createLink(url, item.title || `Link ${index + 1}`));
    listEl.appendChild(li);
    count += 1;
  });
  return count;
}

function setupModal() {
  if (modalElements.initialized) return;

  const root = document.getElementById('promptModal');
  if (!root) return;

  modalElements.root = root;
  modalElements.dialog = root.querySelector('.modal-dialog');
  modalElements.title = root.querySelector('#promptModalTitle');
  modalElements.meta = root.querySelector('#promptModalMeta');
  modalElements.prompt = root.querySelector('#promptModalPrompt');
  modalElements.referenceSection = root.querySelector('#promptModalReference');
  modalElements.referenceText = modalElements.referenceSection?.querySelector('.requirement') ?? null;
  modalElements.sourcesSection = root.querySelector('#promptModalSources');
  modalElements.sourcesList = modalElements.sourcesSection?.querySelector('ul') ?? null;
  modalElements.imageFigure = root.querySelector('.modal-preview');
  modalElements.image = root.querySelector('#promptModalImage');
  modalElements.closeButtons = Array.from(root.querySelectorAll('[data-modal-dismiss]'));

  modalElements.closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  root.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.modalDismiss !== undefined) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalElements.root && !modalElements.root.hidden) {
      closeModal();
    }
  });

  modalElements.initialized = true;
}

function formatPreviewText(text, limit = 240) {
  const trimmed = trimMultiline(text);
  if (trimmed.length <= limit) {
    return trimmed;
  }
  return `${trimmed.slice(0, limit).trim()}…`;
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
  header.append(title);

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

  const body = createElement('div', 'card-body');
  const previewText = formatPreviewText(entry.prompt);
  const preview = createElement('p', 'prompt-preview', previewText || 'Prompt available in details.');
  body.appendChild(preview);

  const actions = createElement('div', 'card-actions');
  const viewButton = document.createElement('button');
  viewButton.type = 'button';
  viewButton.textContent = 'View prompt';
  viewButton.addEventListener('click', () => openModal(entry));
  actions.appendChild(viewButton);
  body.appendChild(actions);

  card.appendChild(body);

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

function fillModal(entry) {
  if (!modalElements.root) return;

  modalElements.title.textContent = entry.title || `Case ${entry.id}`;

  clearChildren(modalElements.meta);
  const caseLabel = createElement('span', null, `Case ${entry.id}`);
  modalElements.meta.appendChild(caseLabel);

  if (entry.author) {
    const authorLabel = createElement('span');
    authorLabel.textContent = 'By ';
    if (entry.authorLink) {
      authorLabel.appendChild(createLink(entry.authorLink, entry.author));
    } else {
      authorLabel.append(entry.author);
    }
    modalElements.meta.appendChild(authorLabel);
  }

  const promptText = trimMultiline(entry.prompt);
  modalElements.prompt.textContent = promptText;

  const referenceText = trimMultiline(entry.referenceNote);
  if (modalElements.referenceSection && modalElements.referenceText) {
    if (referenceText) {
      modalElements.referenceText.textContent = referenceText;
      modalElements.referenceSection.hidden = false;
    } else {
      modalElements.referenceSection.hidden = true;
    }
  }

  if (modalElements.sourcesSection && modalElements.sourcesList) {
    const count = populateModalSources(modalElements.sourcesList, entry.sourceLinks);
    modalElements.sourcesSection.hidden = count === 0;
  }

  if (modalElements.imageFigure && modalElements.image) {
    if (entry.image) {
      modalElements.image.src = entry.image;
      modalElements.image.alt = entry.alt || entry.title || `Case ${entry.id}`;
      modalElements.imageFigure.hidden = false;
    } else {
      modalElements.image.removeAttribute('src');
      modalElements.image.alt = '';
      modalElements.imageFigure.hidden = true;
    }
  }
}

function openModal(entry) {
  if (!modalElements.root) return;

  modalElements.focusTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  fillModal(entry);

  modalElements.root.hidden = false;
  document.body.classList.add('modal-open');
  if (modalElements.dialog) {
    modalElements.dialog.setAttribute('tabindex', '-1');
    modalElements.dialog.focus();
  }
}

function closeModal() {
  if (!modalElements.root || modalElements.root.hidden) return;

  modalElements.root.hidden = true;
  document.body.classList.remove('modal-open');

  if (modalElements.dialog) {
    modalElements.dialog.removeAttribute('tabindex');
  }

  if (modalElements.focusTrigger) {
    modalElements.focusTrigger.focus({ preventScroll: true });
    modalElements.focusTrigger = null;
  }
}

async function init() {
  const grid = document.querySelector('.cards');
  const searchInput = document.getElementById('promptSearch');
  const authorSelect = document.getElementById('authorFilter');
  if (!grid) return;

  grid.innerHTML = '<p class="status">Loading prompt library…</p>';

  try {
    setupModal();
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
