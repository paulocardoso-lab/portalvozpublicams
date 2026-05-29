type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  content?: TiptapNode[];
};

const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "em",
  "h2",
  "h3",
  "img",
  "li",
  "ol",
  "p",
  "strong",
  "ul",
]);

const ALLOWED_ATTRS = new Set(["alt", "class", "href", "src", "title"]);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeUrl(value: unknown) {
  const url = String(value ?? "").trim();
  if (!url) return false;
  return /^(https?:|mailto:|\/)/i.test(url) && !/^javascript:/i.test(url);
}

function sanitizeHtml(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|meta|link)[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|meta|link)[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tagName, rawAttrs) => {
      const tag = String(tagName).toLowerCase();
      const closing = /^<\//.test(match);

      if (!ALLOWED_TAGS.has(tag)) return "";
      if (closing) return `</${tag}>`;

      const attrs: string[] = [];
      String(rawAttrs).replace(/([a-z0-9-:]+)\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, (_attrMatch, name, rawValue) => {
        const attr = String(name).toLowerCase();
        const value = String(rawValue).replace(/^['"]|['"]$/g, "");

        if (!ALLOWED_ATTRS.has(attr)) return "";
        if ((attr === "href" || attr === "src") && !isSafeUrl(value)) return "";

        attrs.push(`${attr}="${escapeHtml(value)}"`);
        return "";
      });

      if (tag === "a") attrs.push('rel="noopener noreferrer"');
      return `<${tag}${attrs.length ? ` ${attrs.join(" ")}` : ""}>`;
    });
}

function renderMarks(text: string, marks: TiptapNode["marks"] = []) {
  return marks.reduce((acc, mark) => {
    if (mark.type === "bold") return `<strong>${acc}</strong>`;
    if (mark.type === "italic") return `<em>${acc}</em>`;
    if (mark.type === "link" && isSafeUrl(mark.attrs?.href)) {
      return `<a href="${escapeHtml(mark.attrs?.href)}" rel="noopener noreferrer">${acc}</a>`;
    }
    return acc;
  }, text);
}

function renderNode(node: TiptapNode): string {
  if (node.type === "text") return renderMarks(escapeHtml(node.text), node.marks);

  const children = (node.content ?? []).map(renderNode).join("");

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading":
      return Number(node.attrs?.level) === 3 ? `<h3>${children}</h3>` : `<h2>${children}</h2>`;
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "hardBreak":
      return "<br>";
    case "image":
      if (!isSafeUrl(node.attrs?.src)) return "";
      return `<img src="${escapeHtml(node.attrs?.src)}" alt="${escapeHtml(node.attrs?.alt)}">`;
    default:
      return children;
  }
}

export function renderArticleBody(body: unknown) {
  if (!body) return "";

  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as TiptapNode;
      return renderNode(parsed);
    } catch {
      return sanitizeHtml(body);
    }
  }

  return renderNode(body as TiptapNode);
}
