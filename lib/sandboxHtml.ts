const THEME_VARS = `
:root {
  --bg: #EFF2F5;
  --bg-alt: #E2E7EC;
  --ink: #0C1115;
  --ink-soft: #2B333A;
  --ink-mute: #6B7680;
  --rule: #0C1115;
  --rule-soft: rgba(12,17,21,0.14);
  --paper: #F7F8FA;
  --dark: #0C1115;
  --dark-ink: #EFF2F5;
  --dark-mute: #7F8892;
  --accent: oklch(0.52 0.12 200);
  --accent-ink: #F7F8FA;
  --sans: Manrope, sans-serif;
  --mono: "JetBrains Mono", monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--dark); color: var(--dark-ink); font-family: var(--sans); }
button, input, select, textarea { font: inherit; }
a { color: inherit; }
`;

function stripModuleSyntax(source: string) {
  return source
    .replace(/^\s*import\s+.+?;?\s*$/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    .replace(/^\s*export\s+\{[^}]+\};?\s*$/gm, "");
}

function looksLikeHtmlDocument(code: string) {
  return /^<!doctype/i.test(code) || /^<html/i.test(code);
}

function looksLikeReactSnippet(code: string) {
  return (
    /ReactDOM|createRoot|className=|useState|useEffect|<\/?[A-Z][A-Za-z0-9]*/.test(
      code,
    ) || /function\s+[A-Z]/.test(code)
  );
}

function wrapPlainHtml(code: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${THEME_VARS}</style>
  </head>
  <body>
    ${code}
    <script>
      window.addEventListener("error", function (event) {
        parent.postMessage({ type: "error", message: event.message || "Simulation error" }, "*");
      });
      window.addEventListener("message", function (event) {
        if (event.data?.type === "init") {
          window.__TRINITY_INIT__ = event.data;
        }
      });
      parent.postMessage({ type: "ready" }, "*");
    </script>
  </body>
</html>`;
}

function wrapReactSnippet(code: string) {
  const cleaned = stripModuleSyntax(code);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>${THEME_VARS}</style>
  </head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script>
      window.__TRINITY_INIT__ = { userName: "Student", slug: "", contentType: "simulation" };
      window.addEventListener("message", function (event) {
        if (event.data?.type === "init") {
          window.__TRINITY_INIT__ = event.data;
        }
      });
      window.addEventListener("error", function (event) {
        parent.postMessage({ type: "error", message: event.message || "Simulation error" }, "*");
      });
    </script>
    <script type="text/babel" data-presets="react">
      const __mountRoot = document.getElementById("root");
      try {
        ${cleaned}
        if (typeof App !== "undefined") {
          ReactDOM.createRoot(__mountRoot).render(React.createElement(App));
        } else if (__mountRoot && __mountRoot.children.length === 0) {
          __mountRoot.innerHTML = '<div style="padding: 24px; color: var(--dark-ink)">Paste a component named <code>App</code> or a full HTML document.</div>';
        }
        parent.postMessage({ type: "ready" }, "*");
      } catch (error) {
        parent.postMessage({ type: "error", message: error?.message || "Simulation failed to mount" }, "*");
      }
    </script>
  </body>
</html>`;
}

function injectBridgeIntoHtmlDocument(code: string) {
  const bridge = `
<script>
window.__TRINITY_INIT__ = { userName: "Student", slug: "", contentType: "simulation" };
window.addEventListener("message", function (event) {
  if (event.data?.type === "init") {
    window.__TRINITY_INIT__ = event.data;
  }
});
window.addEventListener("error", function (event) {
  parent.postMessage({ type: "error", message: event.message || "Simulation error" }, "*");
});
parent.postMessage({ type: "ready" }, "*");
</script>`;

  if (/<\/body>/i.test(code)) {
    return code.replace(/<\/body>/i, `${bridge}</body>`);
  }

  return `${code}\n${bridge}`;
}

export function sandboxHtml(code: string) {
  const trimmed = code.trim();
  if (!trimmed) {
    return wrapPlainHtml(`
      <main style="display:grid;place-items:center;min-height:100vh;padding:24px;">
        <div style="max-width:420px;border:1px solid #2A2A2A;border-radius:4px;padding:24px;background:rgba(255,255,255,0.02);">
          <div style="font-family:var(--mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--dark-mute);">Simulation preview</div>
          <h1 style="font-size:28px;line-height:1;margin:12px 0 0;">No code yet</h1>
          <p style="margin:16px 0 0;color:var(--dark-mute);">Paste a full HTML document or a React snippet named App.</p>
        </div>
      </main>
    `);
  }

  if (looksLikeHtmlDocument(trimmed)) {
    return injectBridgeIntoHtmlDocument(trimmed);
  }

  if (looksLikeReactSnippet(trimmed)) {
    return wrapReactSnippet(trimmed);
  }

  return wrapPlainHtml(trimmed);
}
