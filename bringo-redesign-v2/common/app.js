// Bringo shared UI: header, footer, tab bar, cart helpers, icons, toasts.
// Every customer page imports this one file.
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged } from './firebase-config.js';

/* ------------------------------------------------------------------ icons */
const P = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  cash: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  undo: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  google: '<path fill="#4285F4" stroke="none" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" stroke="none" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.4v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" stroke="none" d="M5.36 14.31a7.2 7.2 0 0 1 0-4.62V6.59H1.4a12 12 0 0 0 0 10.82z"/><path fill="#EA4335" stroke="none" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.43-3.43A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.4 6.59l3.96 3.1A7.2 7.2 0 0 1 12 4.77z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  filter: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  sort: '<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  edit: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  zoom: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>',
  chevdown: '<path d="m6 9 6 6 6-6"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  whatsapp: '<path d="M3 21l1.65-4.9A9 9 0 1 1 8.2 19.4z"/><path d="M9 10c0 3 2.5 5.5 5.5 5.5l1.2-1.2a.8.8 0 0 0 0-1.1l-1.3-.9a.8.8 0 0 0-1 .1l-.5.5a4 4 0 0 1-1.9-1.9l.5-.5a.8.8 0 0 0 .1-1l-.9-1.3a.8.8 0 0 0-1.1 0z"/>',
};
export function icon(name, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;
}

/* ---------------------------------------------------------------- helpers */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rupee = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const initials = (name) => (String(name || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('') || 'B').toUpperCase();
export const waLink = (number, text = '') => `https://wa.me/${String(number).replace(/\D/g, '')}${text ? '?text=' + encodeURIComponent(text) : ''}`;
export const loginUrl = (next) => `login.html${next ? '?next=' + encodeURIComponent(next) : ''}`;
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Broken or missing product images fall back to a neutral placeholder.
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#eef0f4"/><g fill="none" stroke="#a3abba" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="36" y="38" width="48" height="44" rx="8"/><circle cx="50" cy="52" r="5"/><path d="m38 76 16-14 12 10 8-6 10 10"/></g></svg>'
);
export { PLACEHOLDER };
document.addEventListener('error', (e) => {
  const t = e.target;
  if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = PLACEHOLDER; }
}, true);

/* --------------------------------------------------------------- settings */
// Store details live in Firestore at settings/global and are edited from the admin
// panel (Admin > Settings). Anything left blank there falls back to these defaults.
export const DEFAULTS = {
  whatsapp: '917872075844',
  instagram: 'shopbringo',
  phone: '',
  email: '',
  address: '',
  hours: '',
  announcement: '',
  delivery_time: '3 to 7 working days',
  processing_time: '1 to 2 working days',
  return_days: 7,
  banner_interval: 4,
};
let settingsPromise;
export function getSettings() {
  if (!settingsPromise) {
    settingsPromise = getDoc(doc(db, 'settings', 'global'))
      .then((snap) => {
        const out = { ...DEFAULTS };
        if (snap.exists()) {
          for (const [k, v] of Object.entries(snap.data())) if (v !== '' && v != null) out[k] = v;
        }
        return out;
      })
      .catch(() => ({ ...DEFAULTS }));
  }
  return settingsPromise;
}

/* ------------------------------------------------------------------- cart */
const CART_KEY = 'bringo_cart';
export function getCart() {
  try { const c = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(c) ? c : []; } catch { return []; }
}
export function setCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent('bringo:cart'));
}
export const cartCount = () => getCart().reduce((n, i) => n + (Number(i.qty) || 0), 0);
export const cartTotal = () => getCart().reduce((n, i) => n + Number(i.price) * Number(i.qty), 0);
export const cartQty = (id) => (getCart().find((i) => i.id === id) || {}).qty || 0;
export function setItemQty(p, qty) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === p.id);
  if (qty <= 0) { if (idx >= 0) cart.splice(idx, 1); }
  else if (idx >= 0) cart[idx].qty = qty;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image_url || p.image, type: p.payment_type || p.type, qty });
  setCart(cart);
}


/* --------------------------------------------------- wishlist + recently viewed */
const WISH_KEY = 'bringo_wish', RECENT_KEY = 'bringo_recent', PIN_KEY = 'bringo_pin';
const readList = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch { return []; } };
const writeList = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
export const getWish = () => readList(WISH_KEY);
export const isWished = (id) => getWish().includes(id);
let signedIn = null;
function pushWishRemote(list) {
  if (!signedIn) return;
  setDoc(doc(db, 'users', signedIn.uid), { wishlist: list }, { merge: true }).catch(() => {});
}
export function toggleWish(id) {
  const list = getWish();
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1); else list.unshift(id);
  writeList(WISH_KEY, list);
  pushWishRemote(list);
  window.dispatchEvent(new CustomEvent('bringo:wish'));
  return i < 0;
}
async function syncWishlist(user) {
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    const remote = snap.exists() && Array.isArray(snap.data().wishlist) ? snap.data().wishlist : [];
    const local = getWish();
    const merged = [...local, ...remote.filter((x) => !local.includes(x))];
    if (merged.length !== local.length) { writeList(WISH_KEY, merged); window.dispatchEvent(new CustomEvent('bringo:wish')); }
    if (merged.length !== remote.length) pushWishRemote(merged);
  } catch { /* wishlist stays local */ }
}
export const getRecent = () => readList(RECENT_KEY);
export function pushRecent(id) { writeList(RECENT_KEY, [id, ...getRecent().filter((x) => x !== id)].slice(0, 12)); }
export const getSavedPin = () => { try { return localStorage.getItem(PIN_KEY) || ''; } catch { return ''; } };
export const savePin = (v) => { try { localStorage.setItem(PIN_KEY, v); } catch { /* ignore */ } };

/* ---------------------------------------------------- pricing + delivery helpers */
export const mrpOf = (p) => (Number(p.mrp) > Number(p.price) ? Number(p.mrp) : 0);
export const offPct = (p) => (mrpOf(p) ? Math.round((1 - Number(p.price) / mrpOf(p)) * 100) : 0);
// "Key: value" lines (admin textarea) or an array -> [[key, value]]
export function specRows(v) {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === 'object' ? [x.k || x.key || x.label, x.v || x.value] : String(x).split(/:(.*)/s).slice(0, 2))).filter((r) => r[0] && r[1]).map((r) => [String(r[0]).trim(), String(r[1]).trim()]);
  return String(v || '').split(/\n+/).map((l) => l.split(/:(.*)/s)).filter((r) => r[0] && r[1] && r[1].trim()).map((r) => [r[0].trim(), r[1].trim()]);
}
export const lineList = (v) => (Array.isArray(v) ? v : String(v || '').split(/\n+/)).map((x) => String(x).trim()).filter(Boolean);
const nums = (str, def) => { const m = String(str || '').match(/\d+/g) || []; const a = Number(m[0]) || def[0]; return [a, Number(m[1]) || a]; };
function addWorkdays(from, n) { const d = new Date(from); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n--; } return d; }
// Estimated arrival window from the store's processing + delivery times (settings).
export function etaRange(s, from = new Date()) {
  const [p1, p2] = nums(s.processing_time, [1, 2]);
  const [d1, d2] = nums(s.delivery_time, [3, 7]);
  const f = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${f(addWorkdays(from, p1 + d1))} to ${f(addWorkdays(from, p2 + d2))}`;
}

/* ------------------------------------------------------------------ toast */
export function toast(message, kind = 'ok') {
  const host = $('#toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'bad' ? ' is-bad' : '');
  el.setAttribute('role', kind === 'bad' ? 'alert' : 'status');
  el.innerHTML = `${icon(kind === 'bad' ? 'alert' : 'check')}<span>${esc(message)}</span>`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ------------------------------------------------------------- UI building */
export function skeletonCards(n = 4) {
  return Array.from({ length: n }, () => '<div class="skel-card" aria-hidden="true"><div class="skel"></div><div class="skel skel-line" style="width:80%"></div><div class="skel skel-line" style="width:45%"></div></div>').join('');
}
export function emptyState({ ic = 'package', title, text = '', href = '', cta = '' }) {
  return `<div class="empty"><div class="ic-wrap">${icon(ic, 'ic-lg')}</div><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${href ? `<a class="btn btn-primary" href="${esc(href)}">${esc(cta)}</a>` : ''}</div>`;
}

const inStock = (p) => !(Number(p.stock) <= 0);

function buyInner(p) {
  if (!inStock(p)) return '<button class="btn btn-sm btn-block" style="background:var(--bg);color:var(--ink-3)" disabled>Out of stock</button>';
  const q = cartQty(p.id);
  if (!q) return `<button class="btn btn-outline btn-sm btn-block" data-act="add">${icon('plus', 'ic-sm')} Add</button>`;
  return `<div class="stepper" role="group" aria-label="Quantity"><button data-act="dec" aria-label="Remove one">${icon('minus', 'ic-sm')}</button><output aria-live="polite">${q}</output><button data-act="inc" aria-label="Add one more">${icon('plus', 'ic-sm')}</button></div>`;
}

export function productCard(p) {
  const out = !inStock(p);
  const low = !out && Number(p.stock) > 0 && Number(p.stock) <= 5;
  const tag = p.payment_type === 'Prepaid' ? '<span class="pcard-tag tag tag-warn">Prepaid only</span>' : '';
  const href = `product_detail.html?id=${encodeURIComponent(p.id)}`;
  const off = offPct(p);
  const wished = isWished(p.id);
  return `<article class="pcard${out ? ' is-out' : ''}">
    <a class="pcard-media" href="${href}" aria-label="${esc(p.name)}"><img src="${esc(p.image_url)}" alt="" loading="lazy" decoding="async" width="300" height="300">${tag}${off >= 1 ? `<span class="pcard-off">${off}% off</span>` : ''}</a>
    <button class="wish" data-wish="${esc(p.id)}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}">${icon('heart')}</button>
    <div class="pcard-body">
      ${p.brand || p.category ? `<span class="pcard-cat">${esc(p.brand || p.category)}</span>` : ''}
      <a class="pcard-name" href="${href}">${esc(p.name)}</a>
      <div class="pcard-price">${rupee(p.price)}${mrpOf(p) ? ` <s>${rupee(mrpOf(p))}</s>` : ''}</div>
      ${low ? `<span class="pcard-stock">Only ${Number(p.stock)} left</span>` : ''}
      <div class="buy" data-buy="${esc(p.id)}">${buyInner(p)}</div>
    </div></article>`;
}

// Wires the Add button, quantity stepper and wishlist heart on every product card inside `root`.
export function bindBuy(root, lookup, { onWishRemove } = {}) {
  const rerender = () => $$('[data-buy]', root).forEach((w) => { const p = lookup(w.dataset.buy); if (p) w.innerHTML = buyInner(p); });
  const rewish = () => $$('[data-wish]', root).forEach((b) => { const on = isWished(b.dataset.wish); b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist'); });
  root.addEventListener('click', (e) => {
    const heart = e.target.closest('[data-wish]');
    if (heart) {
      const on = toggleWish(heart.dataset.wish);
      toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
      if (!on && onWishRemove) onWishRemove(heart.dataset.wish);
      return;
    }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const wrap = btn.closest('[data-buy]');
    const p = lookup(wrap.dataset.buy);
    if (!p) return;
    const q = cartQty(p.id);
    const act = btn.dataset.act;
    if (act === 'inc' && Number(p.stock) > 0 && q >= Number(p.stock)) return toast(`Only ${p.stock} in stock`, 'bad');
    setItemQty(p, act === 'dec' ? q - 1 : q + 1);
    wrap.querySelector('[data-act="inc"],[data-act="add"]')?.focus();
  });
  window.addEventListener('bringo:cart', rerender);
  window.addEventListener('bringo:wish', rewish);
  window.addEventListener('pageshow', () => { rerender(); rewish(); });
}

// Horizontal scrolling row of product cards (home, product page).
export function rail(title, items, { href = '', more = 'See all' } = {}) {
  if (!items.length) return '';
  return `<section class="section"><div class="sec-head"><h2>${esc(title)}</h2>${href ? `<a class="link-more" href="${esc(href)}">${esc(more)} ${icon('chevron', 'ic-sm')}</a>` : ''}</div><div class="rail">${items.map(productCard).join('')}</div></section>`;
}

/* ----------------------------------------------------------------- chrome */
const NAV = [
  { key: 'home', href: 'index.html', label: 'Home', ic: 'home' },
  { key: 'cart', href: 'cart.html', label: 'Cart', ic: 'cart' },
  { key: 'orders', href: 'order.html', label: 'Orders', ic: 'package' },
  { key: 'account', href: 'profile.html', label: 'Account', ic: 'user' },
];

function footerHtml() {
  return `<footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html"><img src="assets/logo.svg" alt="" width="34" height="34"><span>bringo</span></a>
        <p>Everyday essentials, delivered to your door. Pay on delivery or prepay with UPI, and follow your order until it arrives.</p>
        <div class="foot-social">
          <a data-wa href="#" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}</a>
          <a data-ig href="#" target="_blank" rel="noopener" aria-label="Bringo on Instagram">${icon('instagram')}</a>
        </div>
      </div>
      <div class="foot-links">
        <div><h3>Shop</h3><ul><li><a href="shop.html">All products</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Your cart</a></li><li><a href="order.html">Track an order</a></li></ul></div>
        <div><h3>Help</h3><ul><li><a href="contact.html">Contact us</a></li><li><a href="shipping.html">Shipping &amp; delivery</a></li><li><a href="returns.html">Returns &amp; refunds</a></li></ul></div>
        <div><h3>Company</h3><ul><li><a href="about.html">About Bringo</a></li><li><a href="privacy.html">Privacy policy</a></li><li><a href="terms.html">Terms of use</a></li></ul></div>
      </div>
    </div>
    <div class="foot-bottom"><span>&copy; ${new Date().getFullYear()} Bringo. All rights reserved.</span><div class="foot-pay"><span>Cash on delivery</span><span>UPI prepaid</span></div></div>
  </div></footer>`;
}

function headerHtml({ variant, title, back }) {
  const nav = NAV.filter((n) => n.key !== 'cart');
  return `<header class="hdr" data-variant="${variant}"><div class="wrap hdr-row">
    <a class="icon-btn hdr-back" href="${esc(back)}" aria-label="Go back">${icon('back')}</a>
    <a class="brand" href="index.html"><img src="assets/logo.svg" alt="" width="34" height="34"><span>bringo</span></a>
    <div class="hdr-title" aria-hidden="true">${esc(title)}</div>
    <form class="hdr-search" role="search" id="hdr-search"><label class="sr-only" for="q">Search products</label>${icon('search')}<input id="q" type="search" name="q" placeholder="Search products or categories" autocomplete="off" enterkeyhint="search"></form>
    <nav class="hdr-nav" aria-label="Main">${nav.map((n) => `<a href="${n.href}" data-nav="${n.key}"${n.key === 'account' ? ' data-acct' : ''}>${n.label}</a>`).join('')}</nav>
    <a class="icon-btn" href="wishlist.html" aria-label="Wishlist" data-nav="wishlist">${icon('heart')}<span class="badge" data-wish-count hidden>0</span></a>
    <a class="icon-btn" href="cart.html" aria-label="Cart" data-nav="cart">${icon('cart')}<span class="badge" data-cart-count hidden>0</span></a>
    <a class="icon-btn js-acct-btn" href="login.html" aria-label="Account" data-acct>${icon('user')}</a>
  </div></header>`;
}

function tabbarHtml() {
  return `<nav class="tabbar" aria-label="Main"><ul>${NAV.map((n) => `<li><a href="${n.href}" data-nav="${n.key}"${n.key === 'account' ? ' data-acct' : ''}>${icon(n.ic)}<span>${n.label}</span>${n.key === 'cart' ? '<span class="badge" data-cart-count hidden>0</span>' : ''}</a></li>`).join('')}</ul></nav>`;
}

let lastCount = null;
function syncWishBadge() {
  const n = getWish().length;
  $$('[data-wish-count]').forEach((b) => { b.hidden = n === 0; b.textContent = n > 99 ? '99+' : n; });
}
function syncBadges() {
  const n = cartCount();
  $$('[data-cart-count]').forEach((b) => {
    b.hidden = n === 0;
    b.textContent = n > 99 ? '99+' : n;
    if (lastCount !== null && n !== lastCount && n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
  lastCount = n;
}

function applySettings(s) {
  $$('[data-wa]').forEach((a) => { a.href = waLink(s.whatsapp, 'Hi Bringo, I need some help.'); });
  $$('[data-s]').forEach((el) => { if (s[el.dataset.s] != null && s[el.dataset.s] !== '') el.textContent = s[el.dataset.s]; });
  $$('[data-ig]').forEach((a) => { a.href = `https://www.instagram.com/${String(s.instagram).replace(/^@/, '')}/`; });
  if (s.announcement && !$('.announce')) {
    const bar = document.createElement('div');
    bar.className = 'announce';
    bar.setAttribute('role', 'note');
    bar.textContent = s.announcement;
    document.body.prepend(bar);
  }
}

export let currentUser = null;
export function mountChrome({ variant = 'inner', title = '', back = 'index.html', active = '', tabbar = true, footer = true } = {}) {
  document.body.classList.toggle('no-tabbar', !tabbar);
  document.body.insertAdjacentHTML('afterbegin', headerHtml({ variant, title, back }));
  if (footer) document.body.insertAdjacentHTML('beforeend', footerHtml());
  document.body.insertAdjacentHTML('beforeend', tabbarHtml() + '<div class="toasts" id="toasts"></div>');

  $$('[data-nav]').forEach((a) => { if (a.dataset.nav === active) a.setAttribute('aria-current', 'page'); });
  const hdr = $('.hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Search: filters live on the home page, jumps to the home page from anywhere else.
  const form = $('#hdr-search');
  const input = $('#q');
  const onShop = /(^|\/)shop\.html$/.test(location.pathname);
  if (onShop) input.addEventListener('input', () => window.dispatchEvent(new CustomEvent('bringo:search', { detail: input.value })));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (onShop) window.dispatchEvent(new CustomEvent('bringo:search', { detail: v }));
    else location.href = `shop.html${v ? '?q=' + encodeURIComponent(v) : ''}`;
  });
  if (onShop) { const q = new URLSearchParams(location.search).get('q'); if (q) input.value = q; }

  syncBadges(); syncWishBadge();
  window.addEventListener('bringo:wish', syncWishBadge);
  window.addEventListener('bringo:cart', syncBadges);
  window.addEventListener('storage', (e) => { if (e.key === CART_KEY) syncBadges(); if (e.key === WISH_KEY) syncWishBadge(); });
  window.addEventListener('pageshow', syncBadges);

  onAuthStateChanged(auth, (user) => {
    currentUser = user; signedIn = user;
    if (user) syncWishlist(user);
    $$('[data-acct]').forEach((a) => { a.href = user ? 'profile.html' : loginUrl(); });
    const btn = $('.js-acct-btn');
    if (btn) {
      btn.innerHTML = user
        ? (user.photoURL ? `<img class="avatar" src="${esc(user.photoURL)}" alt="" referrerpolicy="no-referrer" width="34" height="34">` : `<span class="avatar">${esc(initials(user.displayName))}</span>`)
        : icon('user');
      btn.setAttribute('aria-label', user ? 'Your account' : 'Log in');
    }
  });

  return getSettings().then((s) => { applySettings(s); return s; });
}

/* Resolves with the signed-in user (or null) once Firebase has checked. */
export function whenUser() {
  return new Promise((resolve) => { const off = onAuthStateChanged(auth, (u) => { off(); resolve(u); }); });
}

/* ------------------------------------------------------------------ sheets */
// Bottom sheet on phones, centred dialog on desktop. Returns { el, close }.
export function openSheet({ title, html, foot = '', onClose } = {}) {
  const prev = document.activeElement;
  const el = document.createElement('div');
  el.className = 'sheet';
  el.innerHTML = `<div class="sheet-card" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sheet-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${icon('x')}</button></div><div class="sheet-body">${html}</div>${foot ? `<div class="sheet-foot">${foot}</div>` : ''}</div>`;
  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';
  const close = () => {
    if (!el.isConnected) return;
    el.remove(); document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (prev && prev.focus) prev.focus();
    if (onClose) onClose();
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) close(); });
  (el.querySelector('input,select,textarea,button:not([data-close])') || el.querySelector('[data-close]')).focus();
  return { el, close };
}

/* --------------------------------------------------------- shared data loads */
let allProducts;
// All products as an array (loaded once per page).
export function loadAllProducts(getDocs, collection) {
  if (!allProducts) allProducts = getDocs(collection(db, 'products')).then((snap) => { const out = []; snap.forEach((d) => out.push({ ...d.data(), id: d.id })); return out; });
  return allProducts;
}
export const createdTs = (p) => (p.created_at && (p.created_at.seconds || (p.created_at.toDate && p.created_at.toDate().getTime() / 1000))) || 0;

export function confirmDialog({ title, text = '', ok = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    const s = openSheet({ title, html: text ? `<p style="color:var(--ink-2)">${esc(text)}</p>` : '', foot: `<button class="btn btn-outline" data-close>Not now</button><button class="btn ${danger ? 'btn-dark' : 'btn-primary'}" data-ok>${esc(ok)}</button>`, onClose: () => finish(false) });
    s.el.querySelector('[data-ok]').addEventListener('click', () => { finish(true); s.close(); });
  });
}
