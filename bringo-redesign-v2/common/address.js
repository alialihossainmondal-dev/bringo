// Saved delivery addresses (users/{uid}.addresses). Shared by checkout and the addresses page.
import { db, doc, getDoc, setDoc } from './firebase-config.js';
import { esc, openSheet, toast } from './app.js';

export const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

export const cleanPhone = (v) => String(v || '').replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
export const validPhone = (v) => /^[6-9]\d{9}$/.test(cleanPhone(v));
export const validPin = (v) => /^[1-9]\d{5}$/.test(String(v || '').trim());
export const formatAddress = (a) => [a.line1, a.line2, a.city, a.state].filter(Boolean).join(', ') + (a.pin ? ` - ${a.pin}` : '');

// Saved addresses, newest default first. Older accounts that only have a single saved phone + address
// show up as one read-only "legacy" entry so checkout keeps working.
export async function loadAddresses(user) {
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    const d = snap.exists() ? snap.data() : {};
    if (Array.isArray(d.addresses) && d.addresses.length) return [...d.addresses].sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));
    if (d.address && d.phone) return [{ id: 'legacy', label: 'Saved', name: user.displayName || '', phone: d.phone, line1: d.address, legacy: true, default: true }];
  } catch (e) { /* none saved */ }
  return [];
}
export async function saveAddresses(user, list) {
  const def = list.find((a) => a.default) || list[0];
  const clean = list.filter((a) => !a.legacy);
  await setDoc(doc(db, 'users', user.uid), { addresses: clean, ...(def ? { phone: cleanPhone(def.phone), address: formatAddress(def) } : { phone: '', address: '' }) }, { merge: true });
}

const field = (id, label, attrs = '', val = '') => `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" value="${esc(val)}" ${attrs}><div class="field-err" id="e-${id}" hidden></div></div>`;

// Opens the add/edit form. Resolves with the saved address, or null if closed.
export function addressSheet({ user, existing = null }) {
  return new Promise((resolve) => {
    const a = existing || {};
    let result = null;
    const html = `<form id="addr-form" novalidate>
      <div class="field"><label>Address type</label><div class="seg" role="radiogroup" aria-label="Address type">${['Home', 'Work', 'Other'].map((l) => `<label><input type="radio" name="a-label" value="${l}"${(a.label || 'Home') === l ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
      <div style="height:12px"></div>
      <div class="grid-2">${field('a-name', 'Full name', 'autocomplete="name"', a.name || user.displayName || '')}${field('a-phone', 'Mobile number', 'type="tel" inputmode="numeric" maxlength="18" autocomplete="tel-national" placeholder="10-digit number"', a.phone || '')}</div>
      <div style="height:12px"></div>
      ${field('a-line1', 'House no., building, street', 'autocomplete="address-line1"', a.line1 || '')}
      <div style="height:12px"></div>
      ${field('a-line2', 'Area or landmark <span class="muted" style="font-weight:500">(optional)</span>', 'autocomplete="address-line2"', a.line2 || '')}
      <div style="height:12px"></div>
      <div class="grid-2">${field('a-pin', 'PIN code', 'inputmode="numeric" maxlength="6" autocomplete="postal-code"', a.pin || '')}${field('a-city', 'City or town', 'autocomplete="address-level2"', a.city || '')}</div>
      <div style="height:12px"></div>
      <div class="field"><label for="a-state">State</label><select class="input" id="a-state" autocomplete="address-level1"><option value="">Select state</option>${STATES.map((s) => `<option${a.state === s ? ' selected' : ''}>${s}</option>`).join('')}</select><div class="field-err" id="e-a-state" hidden></div></div>
      <label class="fopt" style="margin-top:8px"><input type="checkbox" id="a-def"${a.default || !existing ? ' checked' : ''}><span>Make this my default address</span></label>
    </form>`;
    const s = openSheet({ title: existing ? 'Edit address' : 'Add a new address', html, foot: '<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="a-save">Save address</button>', onClose: () => resolve(result) });
    const $ = (id) => s.el.querySelector(id);
    const err = (id, msg) => { const e = $('#e-' + id); e.hidden = !msg; e.textContent = msg || ''; $('#' + id).setAttribute('aria-invalid', String(!!msg)); return !!msg; };
    $('#a-save').addEventListener('click', async () => {
      const v = (id) => $('#' + id).value.trim();
      let first = null;
      const bad = (id, msg) => { if (err(id, msg) && !first) first = id; };
      bad('a-name', v('a-name').length >= 2 ? '' : 'Enter the name of the person receiving the order.');
      bad('a-phone', validPhone(v('a-phone')) ? '' : 'Enter a valid 10-digit mobile number.');
      bad('a-line1', v('a-line1').length >= 5 ? '' : 'Enter your house number and street.');
      bad('a-pin', validPin(v('a-pin')) ? '' : 'Enter a valid 6-digit PIN code.');
      bad('a-city', v('a-city').length >= 2 ? '' : 'Enter your city or town.');
      bad('a-state', v('a-state') ? '' : 'Select your state.');
      if (first) return $('#' + first).focus();
      const addr = { id: a.id && a.id !== 'legacy' ? a.id : 'a' + Date.now().toString(36), label: s.el.querySelector('input[name="a-label"]:checked').value, name: v('a-name'), phone: cleanPhone(v('a-phone')), line1: v('a-line1'), line2: v('a-line2'), pin: v('a-pin'), city: v('a-city'), state: v('a-state'), default: $('#a-def').checked };
      const btn = $('#a-save'); btn.disabled = true; btn.textContent = 'Saving';
      try {
        let list = (await loadAddresses(user)).filter((x) => !x.legacy);
        const i = list.findIndex((x) => x.id === addr.id);
        if (addr.default || !list.length) { list = list.map((x) => ({ ...x, default: false })); addr.default = true; }
        if (i >= 0) list[i] = addr; else list.push(addr);
        await saveAddresses(user, list);
        result = addr;
        toast('Address saved');
        s.close();
      } catch (e) { btn.disabled = false; btn.textContent = 'Save address'; toast('Could not save the address. Try again.', 'bad'); }
    });
  });
}
