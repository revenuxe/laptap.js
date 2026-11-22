const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, overrides = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(source, { exports, require, setTimeout, clearTimeout, AbortController, Request, fetch, ...overrides }, { filename: file });
  return exports;
}

test('request deadlines settle success, failure, and stalled requests', async () => {
  const { withTimeout } = load('lib/request-timeout.ts');
  assert.equal(await withTimeout(Promise.resolve('ok'), 20), 'ok');
  await assert.rejects(withTimeout(Promise.reject(new Error('offline')), 20), /offline/);
  await assert.rejects(withTimeout(new Promise(() => {}), 5), /took too long/);
});

test('network deadline aborts a stalled fetch', async () => {
  let aborted = false;
  const { fetchWithTimeout } = load('lib/request-timeout.ts', {
    setTimeout: callback => setTimeout(callback, 5),
    fetch: (_input, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => { aborted = true; reject(signal.reason); })),
  });
  await assert.rejects(fetchWithTimeout('https://example.test'), /timed out/);
  assert.equal(aborted, true);
});

test('network wrapper preserves caller cancellation and clears its deadline', async () => {
  const controller = new AbortController();
  let cleared = 0;
  const { fetchWithTimeout } = load('lib/request-timeout.ts', {
    clearTimeout: timer => { cleared++; clearTimeout(timer); },
    fetch: (_input, { signal }) => new Promise((_resolve, reject) => {
      if (signal.aborted) reject(signal.reason);
      else signal.addEventListener('abort', () => reject(signal.reason));
    }),
  });
  const pending = fetchWithTimeout('https://example.test', { signal: controller.signal });
  controller.abort(new Error('navigation cancelled'));
  await assert.rejects(pending, /navigation cancelled/);
  assert.equal(cleared, 1);
});

test('page loader finishes despite rerenders with equivalent search params', () => {
  const timers = new Map();
  const states = [];
  let cursor = 0;
  let previousDependencies;
  let cleanup;
  let timerId = 0;
  let path = '/';
  const hooks = {
    useState: initial => { const index = cursor++; if (!(index in states)) states[index] = initial; return [states[index], value => { states[index] = value; }]; },
    useEffect: (effect, dependencies) => {
      if (!previousDependencies || dependencies.some((value, index) => value !== previousDependencies[index])) {
        cleanup?.(); cleanup = effect(); previousDependencies = dependencies;
      }
    },
  };
  const { default: PageLoader } = load('components/PageLoader.tsx', {
    setTimeout: (callback, delay) => { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearTimeout: id => timers.delete(id),
    require: name => name === 'react' ? hooks : name === 'next/navigation' ? { usePathname: () => path, useSearchParams: () => new URLSearchParams('q=test') } : { jsx: () => ({}), jsxs: () => ({}) },
  });
  const render = () => { cursor = 0; return PageLoader(); };
  render(); render(); render();
  assert.equal(timers.size, 2);
  timers.forEach(({ callback }) => callback());
  assert.equal(render(), null);
  path = '/bangalore'; render();
  assert.equal(timers.size, 2);
  cleanup();
  assert.equal(timers.size, 0);
  path = '/store'; render();
  assert.equal(timers.size, 0, 'store navigation must not add an artificial loading delay');
  assert.equal(render(), null);
});

test('auth loading recovers when session restoration never resolves', async () => {
  const states = [];
  const timers = [];
  let cursor = 0;
  let cleanup;
  const hooks = {
    createContext: () => ({ Provider: 'provider' }),
    useContext: () => ({}),
    useState: initial => { const index = cursor++; states[index] = initial; return [initial, value => { states[index] = value; }]; },
    useEffect: effect => { cleanup = effect(); },
  };
  const supabase = { auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    getSession: () => new Promise(() => {}),
  } };
  const { AuthProvider } = load('contexts/AuthContext.tsx', {
    console: { error() {} },
    setTimeout: callback => { timers.push(callback); return timers.length; },
    clearTimeout() {},
    require: name => name === 'react' ? hooks : name.includes('/supabase/client') ? { supabase } : name.includes('request-timeout') ? { withTimeout: () => Promise.reject(new Error('timed out')) } : { jsx: () => ({}) },
  });
  AuthProvider({ children: null });
  assert.equal(states[3], true);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(states[3], false);
  cleanup();
});
