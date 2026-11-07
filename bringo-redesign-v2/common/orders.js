// Order status helpers shared by the orders list and the order page.
import { icon, esc } from './app.js';

export const STEPS = ['Placed', 'Packing', 'Shipped', 'Delivered'];
// Admin statuses map onto the four steps a customer sees.
export const STEP_OF = { Placed: 0, Confirmed: 1, Processing: 1, Shipped: 2, Dispatched: 2, Delivered: 3 };
export const when = (t) => (t && t.toDate ? t.toDate() : t && t.seconds ? new Date(t.seconds * 1000) : t instanceof Date ? t : null);
export const fmtDate = (d, long = false) => (d ? d.toLocaleDateString('en-IN', long ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const shortId = (id) => String(id).slice(-6).toUpperCase();

export const isCancelled = (o) => o.status === 'Cancelled';
export const isClosed = (o) => ['Cancelled', 'Return accepted', 'Replacement accepted'].includes(o.status);
export const isDelivered = (o) => o.status === 'Delivered' || o.status === 'Return accepted' || o.status === 'Replacement accepted';
export const isActive = (o) => !isClosed(o) && o.status !== 'Delivered';
export const canCancel = (o) => !o.cancel_request && (STEP_OF[o.status] ?? 0) <= 1 && !isClosed(o);

export function statusTag(o) {
  if (o.status === 'Cancelled') return '<span class="tag tag-bad">Cancelled</span>';
  if (o.status === 'Return accepted') return '<span class="tag tag-warn">Return accepted</span>';
  if (o.status === 'Replacement accepted') return '<span class="tag tag-warn">Replacement accepted</span>';
  if (o.status === 'Delivered') return '<span class="tag tag-ok">Delivered</span>';
  return `<span class="tag tag-warn">${esc(STEPS[STEP_OF[o.status] ?? 0])}</span>`;
}
export function trackerHtml(o, cls = '') {
  if (o.status === 'Cancelled') return '';
  const at = isDelivered(o) ? 3 : (STEP_OF[o.status] ?? 0);
  return `<ol class="track ${cls}" aria-label="Order status: ${esc(STEPS[at])}">${STEPS.map((l, i) => `<li class="track-step ${i < at || at === 3 ? 'done' : ''} ${i === at && at !== 3 ? 'now' : ''}"><span class="track-dot">${i < at || at === 3 ? icon('check', 'ic-sm') : ''}</span>${l}</li>`).join('')}</ol>`;
}
