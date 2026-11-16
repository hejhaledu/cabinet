/* =====================================================================
   ŠestaApp – napojení na Firebase (bez knihoven, přes REST)
   - anonymní statistika: denní počítadla v kolekci „statistika“
   - přihlášení správce a čtení statistiky (stránka Správa)
   Žádné IP adresy, jména ani obsah dokumentů se neposílají.
   ===================================================================== */
(function(){
'use strict';
const S = window.SESTA = window.SESTA || {};
const CFG = {
  apiKey: 'AIzaSyCvuuP166CijnaGlfcEsBphZ2MW7kL7_sg',
  projectId: 'sestaapp'
};
const DB = `projects/${CFG.projectId}/databases/(default)/documents`;
const FS = `https://firestore.googleapis.com/v1/${DB}`;
const ss = (() => { try { sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return sessionStorage; } catch(e){ return null; } })();

const EVENTS = ['otevreni','novy','otevreni_souboru','ulozeni','pdf','tisk','zkusebni_rezim'];
const DEVICES = ['pocitac','tablet','telefon'];
const day = (d = new Date()) => new Intl.DateTimeFormat('sv-SE', { timeZone:'Europe/Prague' }).format(d);

/* ---------- anonymní statistika ---------- */
S.analytics = function(rec){
  try {
    if (!/^https?:$/.test(location.protocol)) return;            // ne při otevření ze souboru
    if (/^(localhost|127\.)/.test(location.hostname)) return;    // ne při vývoji
    const app = String(rec.aplikace || '').toLowerCase();
    if (!/^[a-z]{2,20}$/.test(app) || !EVENTS.includes(rec.udalost) || !DEVICES.includes(rec.zarizeni)) return;
    // otevření aplikace se počítá jednou za návštěvu (panel prohlížeče)
    if (rec.udalost === 'otevreni' && ss){ const k = 'sesta:counted:' + app; if (ss.getItem(k)) return; ss.setItem(k, '1'); }
    send(`${app}__${rec.udalost}__${rec.zarizeni}`).then(r => { if (!r.ok) console.warn('ŠestaApp statistika:', r.status, r.message); });
  } catch(e){}
};
/* jeden zápis počítadla; vrací {ok, status, message} */
async function send(field){
  /* jeden dokument = jedno počítadlo za den: statistika/2026-11-16__grid__pdf__pocitac { n } */
  const body = { writes: [{ transform: { document: `${DB}/statistika/${day()}__${field}`,
    fieldTransforms: [{ fieldPath: 'n', increment: { integerValue: '1' } }] } }] };
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/${DB}:commit?key=${CFG.apiKey}`, {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    let msg = ''; if (!r.ok){ try { const j = await r.json(); msg = (j.error && j.error.message) || ''; } catch(e){} }
    return { ok:r.ok, status:r.status, message:msg };
  } catch(e){ return { ok:false, status:0, message:e.message }; }
}

/* ---------- správa: přihlášení ---------- */
const TOK = 'sesta:admin:token';
function saveTok(t){ ss && ss.setItem(TOK, JSON.stringify(t)); }
function getTok(){ try { return JSON.parse(ss && ss.getItem(TOK)); } catch(e){ return null; } }
const ERR = {
  INVALID_LOGIN_CREDENTIALS:'Nesprávný e-mail nebo heslo.', INVALID_PASSWORD:'Nesprávný e-mail nebo heslo.',
  EMAIL_NOT_FOUND:'Nesprávný e-mail nebo heslo.', INVALID_EMAIL:'E-mail nemá správný tvar.',
  USER_DISABLED:'Účet je zablokovaný.', TOO_MANY_ATTEMPTS_TRY_LATER:'Příliš mnoho pokusů. Zkuste to za chvíli.',
  MISSING_PASSWORD:'Zadejte heslo.'
};
async function signIn(email, password){
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CFG.apiKey}`, {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email, password, returnSecureToken:true }) });
  const j = await r.json();
  if (!r.ok){ const code = (j.error && j.error.message || '').split(' ')[0]; throw new Error(ERR[code] || 'Přihlášení se nepovedlo (' + code + ').'); }
  const t = { id:j.idToken, refresh:j.refreshToken, exp: Date.now() + (+j.expiresIn - 60) * 1000, email:j.email };
  saveTok(t); return t;
}
async function token(){
  let t = getTok(); if (!t) return null;
  if (Date.now() < t.exp) return t.id;
  const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`, {
    method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=refresh_token&refresh_token=' + encodeURIComponent(t.refresh) });
  if (!r.ok){ signOut(); return null; }
  const j = await r.json();
  t = { ...t, id:j.id_token, refresh:j.refresh_token, exp: Date.now() + (+j.expires_in - 60) * 1000 }; saveTok(t); return t.id;
}
function signOut(){ ss && ss.removeItem(TOK); }

/* ---------- správa: čtení statistiky ---------- */
async function readStats(fromDay){
  const id = await token(); if (!id) throw new Error('Přihlášení vypršelo. Přihlaste se znovu.');
  const out = {}; let page = '';
  do {
    const r = await fetch(`${FS}/statistika?pageSize=300${page ? '&pageToken=' + encodeURIComponent(page) : ''}`, { headers:{ Authorization:'Bearer ' + id } });
    const j = await r.json();
    if (!r.ok) throw new Error(r.status === 403 ? 'Účet nemá oprávnění číst statistiku (zkontrolujte UID v pravidlech).' : 'Statistiku nejde načíst (' + r.status + ').');
    for (const d of (j.documents || [])){
      const id = d.name.split('/').pop(), i = id.indexOf('__'); if (i < 0) continue;
      const dd = id.slice(0, i), field = id.slice(i + 2); if (fromDay && dd < fromDay) continue;
      const n = d.fields && d.fields.n ? +(d.fields.n.integerValue || d.fields.n.doubleValue || 0) : 0;
      (out[dd] = out[dd] || {})[field] = n;
    }
    page = j.nextPageToken || '';
  } while (page);
  return out;
}

S.fb = { testWrite: () => send('hub__otevreni__pocitac'), signIn, signOut, token, readStats, day, user: () => (getTok() || {}).email || null, EVENTS, DEVICES };
})();
