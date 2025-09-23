import { promptCases } from './data.js';

function createImageGroup(title, urls = []) {
  if (!urls.length) {
    return null;
  }

  const wrapper = document.createElement('section');
  const heading = document.createElement('div');
  heading.className = 'section-title';
  heading.textContent = title;
  const grid = document.createElement('div');
  grid.className = 'gallery';

  urls.forEach((src) => {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = title;
    grid.appendChild(img);
  });

  wrapper.append(heading, grid);
  return wrapper;
}

function renderCase(entry) {
  const card = document.createElement('article');
  card.className = 'card';

  const header = document.createElement('header');
  const title = document.createElement('h2');
  title.textContent = entry.title;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = `Case ${entry.id}`;
  title.appendChild(tag);

  const meta = document.createElement('div');
  meta.className = 'meta';
  const author = document.createElement('span');
  author.textContent = entry.author;
  const link = document.createElement('a');
  link.href = entry.source;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = 'View source ↗';
  meta.append(author, link);

  header.append(title, meta);

  const requirement = document.createElement('div');
  requirement.className = 'requirement';
  requirement.textContent = entry.inputRequirement;

  const prompt = document.createElement('pre');
  prompt.className = 'prompt-text';
  prompt.textContent = entry.prompt;

  card.append(header, requirement);

  const inputGroup = createImageGroup('Inputs', entry.images?.inputs || []);
  if (inputGroup) {
    card.appendChild(inputGroup);
  }

  const outputGroup = createImageGroup('Outputs', entry.images?.outputs || []);
  if (outputGroup) {
    card.appendChild(outputGroup);
  }

  card.append(prompt);

  if (entry.note) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = entry.note;
    card.appendChild(note);
  }

  return card;
}

function init() {
  const grid = document.querySelector('.cards');
  promptCases.forEach((entry) => grid.appendChild(renderCase(entry)));
}

document.addEventListener('DOMContentLoaded', init);
