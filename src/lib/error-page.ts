export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Something went wrong · Laptap</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; }
  .card { max-width: 520px; text-align: center; }
  h1 { font-size: 28px; margin: 0 0 12px; font-weight: 700; }
  p { color: #94a3b8; margin: 0 0 24px; line-height: 1.5; }
  .row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  a, button { border: 0; padding: 12px 20px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
  .primary { background: #3b82f6; color: white; }
  .secondary { background: rgba(255,255,255,0.08); color: #f8fafc; }
</style>
</head>
<body>
<div class="card">
<h1>Something went wrong</h1>
<p>We hit an unexpected error rendering this page. Please try again in a moment.</p>
<div class="row">
<button class="primary" onclick="location.reload()">Try again</button>
<a class="secondary" href="/">Go home</a>
</div>
</div>
</body>
</html>`;
}
