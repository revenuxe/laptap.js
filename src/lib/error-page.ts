// Standalone HTML fallback. MUST NOT import any app code — the same failure
// that triggered this could break any dependency.
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong · Laptap</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
         display:flex; align-items:center; justify-content:center; min-height:100vh;
         background:#0b0b0f; color:#f5f5f7; padding:24px; }
  .card { max-width:440px; text-align:center; }
  h1 { font-size:24px; margin:0 0 8px; }
  p { color:#a1a1aa; margin:0 0 24px; line-height:1.5; }
  .row { display:flex; gap:12px; justify-content:center; }
  a, button { font:inherit; padding:10px 18px; border-radius:10px; border:0; cursor:pointer;
              text-decoration:none; font-weight:600; }
  .primary { background:#f5f5f7; color:#0b0b0f; }
  .ghost { background:transparent; color:#f5f5f7; border:1px solid #3f3f46; }
</style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>We hit an unexpected error loading this page. Please try again in a moment.</p>
    <div class="row">
      <button class="primary" onclick="location.reload()">Refresh</button>
      <a class="ghost" href="/">Go home</a>
    </div>
  </div>
</body>
</html>`;
}
