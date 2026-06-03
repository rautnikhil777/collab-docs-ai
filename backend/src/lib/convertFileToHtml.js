const escapeHtml = (str) => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
};

function mdToHtml(md) {
  // Lightweight markdown conversion for MVP scope:
  // - Escape HTML
  // - Convert headings (#, ##)
  // - Convert lists (-, *)
  // - Convert paragraphs and line breaks

  const lines = md.replaceAll('\r\n', '\n').split('\n');
  let html = '';
  let inUl = false;

  const closeUlIfNeeded = () => {
    if (inUl) {
      html += '</ul>';
      inUl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      closeUlIfNeeded();
      continue;
    }

    const heading1 = line.match(/^#\s+(.+)$/);
    if (heading1) {
      closeUlIfNeeded();
      html += `<h1>${escapeHtml(heading1[1].trim())}</h1>`;
      continue;
    }

    const heading2 = line.match(/^##\s+(.+)$/);
    if (heading2) {
      closeUlIfNeeded();
      html += `<h2>${escapeHtml(heading2[1].trim())}</h2>`;
      continue;
    }

    const ulItem = line.match(/^([-*])\s+(.+)$/);
    if (ulItem) {
      if (!inUl) {
        html += '<ul>';
        inUl = true;
      }
      html += `<li>${escapeHtml(ulItem[2].trim())}</li>`;
      continue;
    }

    closeUlIfNeeded();

    // Paragraph: keep simple and preserve line breaks with <br/>
    html += `<p>${escapeHtml(line.trim()).replaceAll('  ', '&nbsp;&nbsp;')}</p>`;
  }

  closeUlIfNeeded();
  return html || '<p><br/></p>';
}

function txtToHtml(txt) {
  const escaped = escapeHtml(txt.replaceAll('\r\n', '\n'));
  const paragraphs = escaped
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!paragraphs.length) return '<p><br/></p>';

  return paragraphs.map((p) => `<p>${p}</p>`).join('');
}

function convertFileToHtml({ originalName, mimeType, buffer }) {
  const content = buffer.toString('utf-8');
  const lower = String(originalName || '').toLowerCase();

  if (lower.endsWith('.md') || mimeType === 'text/markdown') {
    return mdToHtml(content);
  }

  // Default: txt
  return txtToHtml(content);
}

module.exports = { convertFileToHtml };

