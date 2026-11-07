// Admin page guard. Hides the page until the signed-in user is confirmed as an admin
// (a document with their email as its id in the "admins" collection, same check as login.html).
// NOTE: this only controls what the screen shows. Real protection must come from Firestore security rules.
import { auth, db, doc, getDoc, onAuthStateChanged } from '../common/firebase-config.js';

const root = document.documentElement;
root.style.visibility = 'hidden';
const toLogin = () => location.replace('login.html');
const failSafe = setTimeout(toLogin, 12000);

onAuthStateChanged(auth, async (user) => {
  if (!user || !user.email) { clearTimeout(failSafe); return toLogin(); }
  try {
    const snap = await getDoc(doc(db, 'admins', user.email));
    clearTimeout(failSafe);
    if (snap.exists()) root.style.visibility = '';
    else { await auth.signOut(); toLogin(); }
  } catch (e) { clearTimeout(failSafe); toLogin(); }
});
