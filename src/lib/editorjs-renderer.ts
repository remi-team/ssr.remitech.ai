/**
 * Editor.js JSON renderer — TypeScript port of the legacy
 * `utils/editorjs-renderer.js`.
 *
 * Converts Editor.js block JSON (possibly multi-stringified) into an HTML
 * string for the news detail article body. Supports nested lists, deep JSON
 * parsing, and unknown-block tolerance.
 */

interface EditorBlock {
  type?: string;
  data?: unknown;
}

/** Escape HTML special characters to prevent XSS. */
function escapeHtml(text: unknown): string {
  if (text === null || text === undefined || text === "") return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Deep-parse a JSON value: recursively try to parse strings as JSON.
 * Handles content that has been stringified multiple times.
 */
function deepParseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  // Only attempt to parse strings starting with { or [ to avoid
  // mis-parsing plain text.
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed === "string") return deepParseJson(parsed);
    if (Array.isArray(parsed)) return parsed.map((item) => deepParseJson(item));
    if (parsed && typeof parsed === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(parsed)) {
        result[key] = deepParseJson(val);
      }
      return result;
    }
    return parsed;
  } catch {
    return value;
  }
}

type BlockData = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function renderParagraph(data: BlockData): string {
  return `<p>${str(data.text)}</p>`;
}

function renderHeader(data: BlockData): string {
  const text = str(data.text);
  const level = Math.min(Math.max(Number(data.level) || 2, 1), 6);
  return `<h${level}>${text}</h${level}>`;
}

function renderImage(data: BlockData): string {
  const file = data.file as { url?: string } | undefined;
  const url = file?.url || "";
  if (!url) return "";

  const imgClass = [
    data.withBorder ? "ej-image--bordered" : "",
    data.stretched ? "ej-image--stretched" : "",
    data.withBackground ? "ej-image--bg" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const caption = str(data.caption);
  const imgHtml = `<img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" class="${imgClass}" loading="lazy" />`;
  const captionHtml = caption ? `<figcaption>${caption}</figcaption>` : "";

  return `<figure class="ej-image">${imgHtml}${captionHtml}</figure>`;
}

/** Recursively render a single list item (string or `{ content, items }`). */
function renderListItem(item: unknown): string {
  if (typeof item === "string") return `<li>${item}</li>`;

  if (item && typeof item === "object") {
    const obj = item as BlockData;
    const content = str(obj.content || obj.text);
    const children = obj.items;

    if (Array.isArray(children) && children.length > 0) {
      const subListItems = children.map((child) => renderListItem(child)).join("");
      return `<li>${content}<ul>${subListItems}</ul></li>`;
    }

    return `<li>${content}</li>`;
  }

  return `<li>${String(item)}</li>`;
}

function renderList(data: BlockData): string {
  const items = Array.isArray(data.items) ? data.items : [];
  const style = data.style === "ordered" ? "ol" : "ul";

  if (!items.length) return "";

  const listItems = items.map((item) => renderListItem(item)).join("");
  return `<${style}>${listItems}</${style}>`;
}

function renderChecklist(data: BlockData): string {
  const items = Array.isArray(data.items) ? data.items : [];
  if (!items.length) return "";

  const renderChecklistItem = (item: unknown): string => {
    if (typeof item === "string") {
      return `<li class="ej-checklist__item">
        <span class="ej-checklist__checkbox"></span>
        <span class="ej-checklist__text">${escapeHtml(item)}</span>
      </li>`;
    }

    if (item && typeof item === "object") {
      const obj = item as BlockData;
      const checked = obj.checked ? "checked" : "";
      const text = str(obj.text || obj.content);
      const children = obj.items;

      let subListHtml = "";
      if (Array.isArray(children) && children.length > 0) {
        const subItems = children.map((child) => renderChecklistItem(child)).join("");
        subListHtml = `<ul class="ej-checklist">${subItems}</ul>`;
      }

      return `<li class="ej-checklist__item">
        <span class="ej-checklist__checkbox ${checked ? "ej-checklist__checkbox--checked" : ""}"></span>
        <span class="ej-checklist__text">${escapeHtml(text)}</span>
        ${subListHtml}
      </li>`;
    }

    return `<li class="ej-checklist__item">
      <span class="ej-checklist__checkbox"></span>
      <span class="ej-checklist__text">${escapeHtml(String(item))}</span>
    </li>`;
  };

  const listItems = items.map((item) => renderChecklistItem(item)).join("");
  return `<ul class="ej-checklist">${listItems}</ul>`;
}

function renderQuote(data: BlockData): string {
  const text = str(data.text);
  const caption = str(data.caption);
  const alignment = str(data.alignment) || "left";

  const citeHtml = caption ? `<cite>${caption}</cite>` : "";
  return `<blockquote class="ej-quote ej-quote--${alignment}"><p>${text}</p>${citeHtml}</blockquote>`;
}

function renderDelimiter(): string {
  return '<div class="ej-delimiter"><hr /></div>';
}

function renderCode(data: BlockData): string {
  const code = str(data.code);
  return `<pre class="ej-code"><code>${escapeHtml(code)}</code></pre>`;
}

function renderTable(data: BlockData): string {
  const content = Array.isArray(data.content) ? (data.content as unknown[][]) : [];
  const withHeadings = Boolean(data.withHeadings);

  if (!content.length) return "";

  let html = '<table class="ej-table"><tbody>';

  content.forEach((row, rowIndex) => {
    const isHeading = withHeadings && rowIndex === 0;
    const tag = isHeading ? "th" : "td";
    const cells = (row ?? [])
      .map((cell) => `<${tag}>${escapeHtml(cell)}</${tag}>`)
      .join("");
    html += `<tr>${cells}</tr>`;
  });

  html += "</tbody></table>";
  return html;
}

function renderWarning(data: BlockData): string {
  const title = str(data.title);
  const message = str(data.message);

  const titleHtml = title ? `<h4 class="ej-warning__title">${escapeHtml(title)}</h4>` : "";
  const messageHtml = message ? `<p class="ej-warning__message">${escapeHtml(message)}</p>` : "";

  return `<div class="ej-warning">${titleHtml}${messageHtml}</div>`;
}

function renderEmbed(data: BlockData): string {
  const embed = str(data.embed);
  const source = str(data.source);
  const caption = str(data.caption);
  const service = str(data.service);

  if (embed) {
    const captionHtml = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
    return `<figure class="ej-embed">
      <div class="ej-embed__container">${embed}</div>
      ${captionHtml}
    </figure>`;
  }

  if (source) {
    return `<div class="ej-embed">
      <a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer" class="ej-embed__link">
        ${escapeHtml(service || "Embedded content")} &#8599;
      </a>
    </div>`;
  }

  return "";
}

function renderRaw(data: BlockData): string {
  return str(data.html);
}

function renderAttaches(data: BlockData): string {
  const file = data.file as { url?: string; name?: string; size?: number } | undefined;
  const url = file?.url || "";
  const name = file?.name || str(data.title) || "Download";
  const size = file?.size ? ` (${formatFileSize(file.size)})` : "";

  if (!url) return "";

  return `<div class="ej-attaches">
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="ej-attaches__link">
      <span class="ej-attaches__icon">📎</span>
      <span class="ej-attaches__name">${escapeHtml(name)}</span>
      <span class="ej-attaches__size">${size}</span>
    </a>
  </div>`;
}

/** Format a byte size into a human-readable string. */
function formatFileSize(bytes: number): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Block type → renderer map. */
const blockRenderers: Record<string, (data: BlockData) => string> = {
  paragraph: renderParagraph,
  header: renderHeader,
  image: renderImage,
  list: renderList,
  checklist: renderChecklist,
  quote: renderQuote,
  delimiter: () => renderDelimiter(),
  code: renderCode,
  table: renderTable,
  warning: renderWarning,
  embed: renderEmbed,
  raw: renderRaw,
  attaches: renderAttaches,
};

/**
 * Render a single Editor.js block to HTML.
 * Block data is deep-parsed first to handle nested JSON strings.
 */
export function renderBlock(block: EditorBlock): string {
  if (!block || !block.type) return "";

  const data = deepParseJson(block.data ?? {}) as BlockData;

  const renderer = blockRenderers[block.type];
  if (renderer) {
    return renderer(data && typeof data === "object" ? data : {});
  }

  // Unknown block type — tolerate silently (parity with the legacy renderer).
  return "";
}

/**
 * Render Editor.js JSON content into an HTML string.
 * Supports multi-layer nested JSON parsing.
 */
export function renderEditorJsContent(content: unknown): string {
  if (!content) return "";

  // Deep parse: handles content that has been stringified multiple times.
  const data = deepParseJson(content);

  // If still a string after parsing, return it directly (plain HTML/text).
  if (typeof data === "string") return data;

  // Extract the blocks array.
  let blocks: unknown = null;

  if (Array.isArray(data)) {
    blocks = data;
  } else if (data && typeof data === "object") {
    const obj = data as BlockData;
    const nestedData = obj.data as BlockData | undefined;
    const nestedContent = obj.content as BlockData | undefined;
    blocks =
      obj.blocks ||
      (nestedData && typeof nestedData === "object" ? nestedData.blocks : null) ||
      (nestedContent && typeof nestedContent === "object" ? nestedContent.blocks : null) ||
      null;
  }

  if (!blocks || !Array.isArray(blocks)) {
    // No blocks array — render the object as preformatted JSON.
    if (typeof data === "object" && !Array.isArray(data)) {
      return `<pre class="ej-code"><code>${escapeHtml(JSON.stringify(data, null, 2))}</code></pre>`;
    }
    return "";
  }

  return blocks
    .map((block) => renderBlock(block as EditorBlock))
    .filter(Boolean)
    .join("\n");
}
