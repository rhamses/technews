import { parseHTML } from "linkedom";
import {
  bundledLanguages,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const LIGHT_THEME = "github-light";
const DARK_THEME = "github-dark";

const PRELOAD_LANGS = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "python",
  "sql",
  "bash",
  "shell",
  "json",
  "yaml",
  "html",
  "css",
  "go",
  "rust",
  "java",
  "c",
  "cpp",
  "ruby",
  "php",
  "xml",
  "markdown",
  "diff",
  "toml",
  "graphql",
  "dockerfile",
  "text",
] as const satisfies readonly BundledLanguage[];

const LANG_ALIASES: Record<string, BundledLanguage> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "shell",
  zsh: "bash",
  yml: "yaml",
  plaintext: "text",
  plain: "text",
  text: "text",
  console: "shell",
  terminal: "shell",
  golang: "go",
  rs: "rust",
  "c++": "cpp",
  dockerfile: "dockerfile",
  docker: "dockerfile",
  md: "markdown",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  // Cloudflare/workerd blocks runtime Wasm compilation used by Oniguruma.
  highlighterPromise ??= createHighlighter({
    themes: [LIGHT_THEME, DARK_THEME],
    langs: [...PRELOAD_LANGS],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });
  return highlighterPromise;
}

function normalizeLang(raw: string | undefined): BundledLanguage {
  if (!raw) {
    return "text";
  }

  const key = raw.trim().toLowerCase();
  const aliased = LANG_ALIASES[key] ?? (key as BundledLanguage);
  if (aliased in bundledLanguages || aliased === "text") {
    return aliased;
  }
  return "text";
}

function detectLanguage(...nodes: Array<Element | null | undefined>): BundledLanguage {
  const classes: string[] = [];

  for (const node of nodes) {
    let current: Element | null | undefined = node;
    let depth = 0;
    while (current && depth < 4) {
      classes.push(current.getAttribute("class") ?? "");
      current = current.parentElement;
      depth += 1;
    }
  }

  const className = classes.join(" ");
  const match = className.match(
    /(?:language|lang|highlight-source)-([a-z0-9_+#.-]+)/i,
  );
  return normalizeLang(match?.[1]);
}

async function highlightCode(code: string, lang: BundledLanguage): Promise<string> {
  const highlighter = await getHighlighter();
  let resolved: BundledLanguage = lang;

  try {
    if (!highlighter.getLoadedLanguages().includes(lang) && lang !== "text") {
      await highlighter.loadLanguage(lang);
    }
  } catch {
    resolved = "text";
  }

  try {
    return highlighter.codeToHtml(code.replace(/\n$/, ""), {
      lang: resolved,
      themes: {
        light: LIGHT_THEME,
        dark: DARK_THEME,
      },
      defaultColor: false,
    });
  } catch {
    return highlighter.codeToHtml(code.replace(/\n$/, ""), {
      lang: "text",
      themes: {
        light: LIGHT_THEME,
        dark: DARK_THEME,
      },
      defaultColor: false,
    });
  }
}

function resolveImageSrc(img: Element): string | null {
  const src = img.getAttribute("src")?.trim();
  if (src && !src.startsWith("data:")) {
    return src;
  }

  const srcset = img.getAttribute("srcset")?.trim();
  if (!srcset) {
    return null;
  }

  const candidates = srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((value) => value && !value.startsWith("data:"));

  return candidates.at(-1) ?? null;
}

function wrapTables(root: Element, document: Document) {
  for (const table of [...root.querySelectorAll("table")]) {
    if (table.closest(".table-scroll")) {
      continue;
    }

    // Promote bold-only first rows (common in extracted CMS HTML) into a real header.
    if (!table.querySelector("thead")) {
      const firstRow = table.querySelector("tr");
      const cells = firstRow ? [...firstRow.querySelectorAll(":scope > td, :scope > th")] : [];
      const looksLikeHeader =
        cells.length > 0 &&
        cells.every((cell) => {
          const text = cell.textContent?.trim() ?? "";
          if (!text) {
            return false;
          }
          const strong = cell.querySelector("strong, b");
          return Boolean(strong) || cell.tagName === "TH";
        });

      if (looksLikeHeader && firstRow) {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        for (const cell of cells) {
          const th = document.createElement("th");
          th.innerHTML = cell.innerHTML;
          for (const attr of cell.attributes) {
            th.setAttribute(attr.name, attr.value);
          }
          headerRow.append(th);
        }
        thead.append(headerRow);
        firstRow.remove();
        table.prepend(thead);
        if (!table.querySelector("tbody")) {
          const bodyRows = [...table.querySelectorAll(":scope > tr")];
          if (bodyRows.length) {
            const tbody = document.createElement("tbody");
            for (const row of bodyRows) {
              tbody.append(row);
            }
            table.append(tbody);
          }
        }
      }
    }

    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    table.replaceWith(wrapper);
    wrapper.append(table);
  }
}

function wrapImages(root: Element, document: Document) {
  for (const img of [...root.querySelectorAll("img")]) {
    if (img.closest("button.article-lightbox-trigger")) {
      continue;
    }

    const src = resolveImageSrc(img);
    if (!src) {
      continue;
    }

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.className = "article-lightbox-trigger";
    button.setAttribute("data-lightbox-src", src);
    button.setAttribute(
      "aria-label",
      img.getAttribute("alt")?.trim() || "View larger image",
    );

    const parentLink = img.closest("a");
    if (parentLink && parentLink.querySelectorAll("img").length === 1) {
      parentLink.replaceWith(button);
      button.append(img);
      continue;
    }

    img.replaceWith(button);
    button.append(img);
  }
}

async function highlightCodeBlocks(root: Element, document: Document) {
  const blocks = [...root.querySelectorAll("pre")];

  for (const pre of blocks) {
    if (pre.closest(".article-code, .shiki")) {
      continue;
    }

    const codeEl = pre.querySelector("code");
    const lang = detectLanguage(pre, codeEl, pre.parentElement);
    const source = (codeEl ?? pre).textContent ?? "";
    if (!source.trim()) {
      continue;
    }

    const highlighted = await highlightCode(source, lang);
    const wrapper = document.createElement("figure");
    wrapper.className = "article-code";
    if (lang !== "text") {
      wrapper.setAttribute("data-lang", lang);
    }
    wrapper.innerHTML = highlighted;
    pre.replaceWith(wrapper);
  }
}

export async function enhanceArticleHtml(html: string): Promise<string> {
  if (!html.trim()) {
    return html;
  }

  const { document } = parseHTML(`<!doctype html><html><body><div id="__root">${html}</div></body></html>`);
  const root = document.getElementById("__root");
  if (!root) {
    return html;
  }

  await highlightCodeBlocks(root, document);
  wrapTables(root, document);
  wrapImages(root, document);

  return root.innerHTML;
}
