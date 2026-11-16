/* =====================================================================
   ŠestaApp – sdílená kostra v1.0
   Hlavička (logo, nabídka aplikací, 7 ikon), patička, Nastavení,
   zkušební režim, klávesové zkratky, soubory (obálka .json), kontrola
   před tiskem, oznámení se „Vrátit“, prázdný stav, „Co je nového“,
   telefonní lišta a anonymní statistika.
   Aplikace volá:  Sesta.init({...})  – viz README.md
   ===================================================================== */
(function(){
'use strict';
const S = window.SESTA = window.SESTA || {};
const doc = document;
const ss = (() => { try { sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return sessionStorage; } catch(e){ const m={}; return {getItem:k=>k in m?m[k]:null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]}}; } })();
const ls = (() => { try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; } catch(e){ return ss; } })();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- ikony (styl Lucide) ---------- */
const P = {
  new:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 18v-6M9 15h6"/>',
  open:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7"/>',
  pdf:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 18v-6M9 15l3 3 3-3"/>',
  print:'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  gear:'<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  chev:'<path d="m6 9 6 6 6-6"/>',
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18" stroke-dasharray="2.5 2"/>',
  desks:'<path d="M5 4h14"/><rect x="3" y="9" width="7.5" height="4.5" rx="1"/><rect x="13.5" y="9" width="7.5" height="4.5" rx="1"/><rect x="3" y="16" width="7.5" height="4.5" rx="1"/><rect x="13.5" y="16" width="7.5" height="4.5" rx="1"/>',
  car:'<path d="M5 17h14M6 17l1.5-6h9L18 17M7.5 11 9 7h6l1.5 4"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  brand:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
  flask:'<path d="M9 3h6M10 3v6.5L4.6 18.4A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.4-2.6L14 9.5V3"/><path d="M7.5 15h9"/>',
  keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4M7 16h10"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'
};
const icon = (n, cls='s-i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;
S.icon = icon;
const isMac = /Mac|iPhone|iPad/.test(navigator.platform||'');
const MOD = isMac ? '⌘' : 'Ctrl';

/* ---------- stav kostry ---------- */
let C = null;               // konfigurace aplikace
let A = null;               // záznam aplikace z apps.js
const K = id => 'sesta:' + id + ':' + (C ? C.app : 'hub');
const st = {
  get dirty(){ return ss.getItem(K('dirty')) === '1'; },
  set dirty(v){ v ? ss.setItem(K('dirty'),'1') : ss.removeItem(K('dirty')); },
  get saved(){ return ss.getItem(K('saved')); },
  set saved(v){ ss.setItem(K('saved'), v); },
  get trial(){ return ss.getItem(K('trial')) !== null; }
};
let leaving = false;        // přechod v rámci ŠestaApp (neptat se při odchodu)
const $ = s => doc.querySelector(s);

/* ---------- motiv ---------- */
function theme(){ return doc.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
function setTheme(t){
  doc.documentElement.dataset.theme = t;
  try { ls.setItem('sestaapp-theme', t); } catch(e){}
  const b = $('#sTheme'); if (b){ b.innerHTML = icon(t==='dark'?'sun':'moon'); b.dataset.tip = t==='dark' ? 'Světlý režim' : 'Noční režim'; b.setAttribute('aria-label', b.dataset.tip); }
  C && C.onTheme && C.onTheme(t);
}
S.setTheme = setTheme; S.theme = theme;

/* ---------- pomocné prvky ---------- */
function el(html){ const t = doc.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
S.esc = esc;

/* oznámení */
function toast(msg, o={}){
  let box = $('.s-toasts'); if (!box){ box = el('<div class="s-toasts" role="status" aria-live="polite"></div>'); doc.body.appendChild(box); }
  const kind = o.kind || '';
  const t = el(`<div class="s-toast ${kind}">${icon(kind==='err'?'alert':kind==='ok'?'check':'info')}<span>${esc(msg)}</span></div>`);
  if (o.action){ const b = el(`<button type="button">${esc(o.action.label)}</button>`); b.onclick = () => { o.action.run(); t.remove(); }; t.appendChild(b); }
  box.appendChild(t);
  setTimeout(() => t.remove(), o.time || (o.action ? 6000 : 3200));
}
S.toast = toast;

/* okno */
function modal({title, body, buttons=[], wide=false, onOpen}){
  const bg = el(`<div class="s-modal-bg"><div class="s-modal ${wide?'wide':''}" role="dialog" aria-modal="true"><div class="s-modal-h"><span></span><button class="s-x" type="button" aria-label="Zavřít">${icon('x')}</button></div><div class="s-modal-b"></div><div class="s-modal-f"></div></div></div>`);
  bg.querySelector('.s-modal-h span').textContent = title;
  const b = bg.querySelector('.s-modal-b'); if (typeof body === 'string') b.innerHTML = body; else if (body) b.appendChild(body);
  const f = bg.querySelector('.s-modal-f');
  const close = () => { bg.remove(); doc.removeEventListener('keydown', key, true); };
  const key = e => { if (e.key === 'Escape'){ e.stopPropagation(); close(); } };
  if (!buttons.length) f.remove();
  for (const btn of buttons){
    const x = el(`<button type="button" class="s-btn ${btn.kind||''}">${esc(btn.label)}</button>`);
    x.onclick = () => { const r = btn.run && btn.run(bg); if (r !== false) close(); };
    f.appendChild(x);
  }
  bg.querySelector('.s-x').onclick = close;
  bg.addEventListener('mousedown', e => { if (e.target === bg) close(); });
  doc.addEventListener('keydown', key, true);
  doc.body.appendChild(bg);
  onOpen && onOpen(bg);
  const pri = f && f.querySelector('.pri'); (pri || bg.querySelector('.s-x')).focus();
  return {close, el:bg};
}
S.modal = modal;

/* bublina */
let tipEl, tipT, tipFor;
function tipShow(t){
  if (!tipEl){ tipEl = el('<div class="s-tip" role="tooltip"></div>'); doc.body.appendChild(tipEl); }
  const k = t.dataset.key;
  tipEl.innerHTML = esc(t.dataset.tip) + (k ? `<kbd>${esc(k)}</kbd>` : '');
  const r = t.getBoundingClientRect(); tipEl.style.left = '0px'; tipEl.style.top = '0px'; tipEl.classList.add('show');
  const w = tipEl.offsetWidth;
  tipEl.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width/2 - w/2)) + 'px';
  tipEl.style.top = (r.bottom + 8) + 'px';
}
function tipHide(){ clearTimeout(tipT); tipFor = null; tipEl && tipEl.classList.remove('show'); }
doc.addEventListener('pointerover', e => {
  const t = e.target.closest && e.target.closest('[data-tip]');
  if (t === tipFor) return; tipHide(); if (!t || e.pointerType === 'touch') return;
  tipFor = t; tipT = setTimeout(() => tipShow(t), 400);
});
doc.addEventListener('pointerdown', tipHide, true);
doc.addEventListener('scroll', tipHide, true);

/* nabídky – otevírají se kliknutím, otevřená je vždy jen jedna */
let openMenu = null;
function closeMenus(){ if (openMenu){ openMenu.classList.remove('open'); openMenu.parentElement && openMenu.parentElement.classList.remove('open'); openMenu = null; } }
function toggleMenu(m, anchor){
  if (openMenu === m){ closeMenus(); return; }
  closeMenus(); openMenu = m; m.classList.add('open');
  if (anchor){
    const r = anchor.getBoundingClientRect(), mw = m.offsetWidth;
    m.style.position = 'fixed'; m.style.top = (r.bottom + 6) + 'px';
    m.style.left = Math.max(8, Math.min(innerWidth - mw - 8, r.right - mw)) + 'px';
  }
}
doc.addEventListener('mousedown', e => { if (openMenu && !openMenu.contains(e.target) && !e.target.closest('[data-menu]') && !e.target.closest('.s-brand')) closeMenus(); });
S.closeMenus = closeMenus;
function menuItems(items){
  return items.map(it => {
    if (it === '-') return '<div class="s-mhr"></div>';
    if (it.head) return `<div class="s-mh">${esc(it.head)}</div>`;
    return `<button type="button" class="s-mi ${it.danger?'danger':''} ${it.on?'on':''}" ${it.disabled?'disabled':''} data-i="${it._i}">${icon(it.icon||'info')}<span>${esc(it.label)}</span>${it.key?`<span class="s-k">${esc(it.key)}</span>`:''}</button>`;
  }).join('');
}
function fillMenu(m, items){
  items.forEach((it,i) => { if (typeof it === 'object') it._i = i; });
  m.innerHTML = menuItems(items);
  m.querySelectorAll('.s-mi').forEach(b => b.onclick = () => { closeMenus(); const it = items[+b.dataset.i]; it.run && it.run(); });
}

/* ---------- soubory ---------- */
const LEGACY = { 'SestaApp-GRID':'grid', 'SestaApp-Zasedacka':'zasedacka', 'SestaApp-Cestak':'cestak', 'sestaapp-cestak':'cestak' };
function wrap(data, title){
  return { sestaapp: C.app, verze: (A && A.version) || '1.0', vytvoreno: new Date().toISOString().slice(0,19), nazev: title || '', data };
}
function identify(o){
  if (!o || typeof o !== 'object') return null;
  if (o.sestaapp && o.data) return { app:o.sestaapp, data:o.data, title:o.nazev||'' };
  if (o.app && LEGACY[o.app]) return { app:LEGACY[o.app], data:o, title:'' };
  if (C && C.legacy){ const d = C.legacy(o); if (d) return { app:C.app, data:d, title:'' }; }
  return null;
}
const ascii = s => String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9.\-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
function fileName(parts, ext){
  const app = ascii((A ? A.name : 'SestaApp')).toUpperCase();
  const p = [app, ...parts.map(ascii).filter(Boolean)];
  return p.join('_') + '.' + ext;
}
const today = () => new Date().toISOString().slice(0,10);
function download(blob, name){
  const a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  doc.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
S.download = download; S.fileName = fileName; S.today = today; S.ascii = ascii;

function receive(text, name){
  let o; try { o = JSON.parse(text); } catch(e){ toast('Soubor nejde přečíst. Vyberte soubor .json uložený v ŠestaApp.', {kind:'err'}); return; }
  const id = identify(o);
  if (!id){ toast('Tento soubor nepatří do ŠestaApp.', {kind:'err'}); return; }
  if (id.app !== C.app){
    const tgt = S.apps.find(a => a.id === id.app);
    if (!tgt){ toast('Soubor patří do aplikace, která tu není.', {kind:'err'}); return; }
    modal({ title:'Soubor z jiné aplikace',
      body:`<p>Soubor <b>${esc(name)}</b> patří do aplikace <b>${esc(tgt.name)}</b>. Otevřít ho tam?</p>`,
      buttons:[{label:'Zrušit'}, {label:`Otevřít v ${tgt.name}`, kind:'pri', run:() => {
        ss.setItem('sesta:incoming', JSON.stringify({app:id.app, data:id.data, name}));
        go(C.root + tgt.path);
      }}]});
    return;
  }
  try { C.load(id.data, {name, title:id.title}); }
  catch(e){ console.error(e); toast('Soubor nejde otevřít: ' + e.message, {kind:'err'}); return; }
  st.dirty = false; st.saved = 'Otevřeno ' + name; refresh(); hideEmpty();
  toast('Otevřeno: ' + name, {kind:'ok'}); track('otevreni_souboru');
}
function pickFile(){
  let inp = $('#sFile');
  if (!inp){ inp = el('<input type="file" id="sFile" accept=".json,application/json" hidden>'); doc.body.appendChild(inp);
    inp.onchange = async () => { const f = inp.files[0]; inp.value = ''; if (f) receive(await f.text(), f.name); }; }
  inp.click();
}

/* ---------- akce v hlavičce ---------- */
function guard(proceed){
  if (!st.dirty || st.trial) return proceed();
  modal({ title:'Máte neuložené změny', body:'<p>Rozpracovaný dokument není uložený do souboru. Co s ním?</p>',
    buttons:[{label:'Zrušit'}, {label:'Zahodit', kind:'danger', run:proceed}, {label:'Uložit a pokračovat', kind:'pri', run:() => { if (doSave()) setTimeout(proceed, 50); }}]});
}
function doNew(){
  if (!C.actions.new) return;
  const run = () => { endTrial(true); C.actions.new(); st.dirty = false; ss.removeItem(K('saved')); ss.removeItem(K('empty-off')); refresh(); checkEmpty(); track('novy'); };
  guard(run);
}
function doOpen(){
  if (!C.load) return;
  guard(() => { endTrial(true); pickFile(); });
}
function doSave(){
  if (!C.serialize) return false;
  if (st.trial){ toast('Ve zkušebním režimu se neukládá.'); return false; }
  const data = C.serialize(), title = C.title ? C.title() : '';
  const name = fileName(C.fileParts ? C.fileParts() : [title, today()], 'json');
  download(new Blob([JSON.stringify(wrap(data, title), null, 2)], {type:'application/json'}), name);
  st.dirty = false; const d = new Date(); st.saved = 'Uloženo ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
  refresh(); toast('Uloženo: ' + name, {kind:'ok'}); track('ulozeni');
  return true;
}
/* výstup s kontrolou před tiskem */
function output(kind, run){
  const issues = (C.check && C.check(kind)) || [];
  const go = () => { Promise.resolve(run()).then(() => track(kind === 'print' ? 'tisk' : 'pdf')); };
  if (!issues.length) return go();
  const list = el('<ul class="s-issues"></ul>');
  const m = modal({ title:'Ještě zkontrolujte', body:el('<div></div>'),
    buttons:[{label: kind === 'print' ? 'Přesto vytisknout' : 'Přesto stáhnout', run:go}, {label:'Opravit', kind:'pri', run:() => { issues[0].go && issues[0].go(); }}]});
  issues.forEach(i => {
    const li = el(`<li class="${i.level==='err'?'err':''}">${icon(i.level==='err'?'alert':'info')}<span>${esc(i.text)}</span></li>`);
    li.onclick = () => { m.close(); i.go && i.go(); };
    list.appendChild(li);
  });
  m.el.querySelector('.s-modal-b').append(el('<p>Než dokument vytisknete, podívejte se na tyto věci:</p>'), list);
}
S.output = output;
function doPdf(i=0){ const v = C.actions.pdf && C.actions.pdf[i]; if (v) output('pdf', v.run); }
function doPrint(){ if (C.actions.print) output('print', C.actions.print); }

/* ---------- zkušební režim ---------- */
function startTrial(){
  if (!C.trial || st.trial) return;
  ss.setItem(K('trial'), JSON.stringify({ data:C.trial.get(), dirty:st.dirty, saved:st.saved }));
  C.trial.set(C.trial.sample());
  hideEmpty(); refresh(); track('zkusebni_rezim');
  toast('Zkušební režim zapnut – vaše práce je odložená stranou.');
}
function endTrial(silent){
  const raw = ss.getItem(K('trial')); if (raw === null) return;
  ss.removeItem(K('trial'));
  try { const o = JSON.parse(raw); C.trial.set(o.data); st.dirty = !!o.dirty; if (o.saved) st.saved = o.saved; } catch(e){ console.error(e); }
  refresh(); checkEmpty();
  if (!silent) toast('Zkušební režim ukončen – vrátila se vaše práce.', {kind:'ok'});
}
S.isTrial = () => st.trial;

/* ---------- prázdný stav ---------- */
function hideEmpty(){ const e = $('.s-empty'); e && e.remove(); }
function checkEmpty(){
  hideEmpty();
  if (!C || !C.empty || st.trial || ss.getItem(K('empty-off')) || !C.empty.test()) return;
  const host = typeof C.empty.host === 'string' ? $(C.empty.host) : C.empty.host; if (!host) return;
  const e = el(`<div class="s-empty"><div class="s-empty-box"><div class="s-empty-tile">${icon(A.icon)}</div><h2>${esc(A.name)}</h2><p>${esc(C.empty.text)}</p>
    <div class="s-empty-btns"><button type="button" class="s-btn pri" data-a="start">Začít</button><button type="button" class="s-btn" data-a="open">${icon('open')}Otevřít soubor</button><button type="button" class="s-btn" data-a="trial">${icon('flask')}Vyzkoušet na ukázce</button></div>
    <small>nebo sem přetáhněte uložený soubor .json</small></div></div>`);
  e.querySelector('[data-a=start]').onclick = () => { ss.setItem(K('empty-off'),'1'); hideEmpty(); C.empty.start && C.empty.start(); };
  e.querySelector('[data-a=open]').onclick = () => pickFile();
  e.querySelector('[data-a=trial]').onclick = startTrial;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.appendChild(e);
}
S.checkEmpty = checkEmpty;

/* ---------- změny a stav v podtitulku ---------- */
function changed(){ if (!st.trial && !st.dirty){ st.dirty = true; refresh(); } else if (!st.trial) st.dirty = true; }
S.changed = changed;
function refresh(){
  if (!C) return;
  const sub = $('#sSub'); if (sub){
    const parts = [A.desc]; const ctx = C.subtitle && C.subtitle(); if (ctx) parts.push(ctx);
    let stHtml = '';
    if (st.trial) stHtml = '<span class="s-state trial">Zkušební režim</span>';
    else if (st.dirty) stHtml = '<span class="s-state dirty">Neuloženo</span>';
    else if (st.saved) stHtml = `<span class="s-state">${esc(st.saved)}</span>`;
    sub.innerHTML = parts.map(esc).join(' · ') + (stHtml ? ' · ' + stHtml : '');
  }
  const dot = $('#sSaveDot'); if (dot) dot.hidden = !(st.dirty && !st.trial);
  const sv = $('#sSave'); if (sv){ sv.disabled = st.trial || !C.serialize; sv.dataset.tip = st.trial ? 'Ve zkušebním režimu se neukládá' : 'Uložit'; }
  let bar = $('#sTrialBar');
  if (st.trial && !bar){
    bar = el(`<div class="s-bar trial" id="sTrialBar">${icon('flask')}<span class="s-grow">Zkušební režim – pracujete s ukázkovými daty, nic se neukládá.</span><button type="button" class="s-btn sm">Ukončit zkušební režim</button></div>`);
    bar.querySelector('button').onclick = () => endTrial();
    $('.s-header').after(bar);
  } else if (!st.trial && bar) bar.remove();
}
S.refresh = refresh;

/* ---------- navigace ---------- */
function go(url){ leaving = true; location.href = url; }
S.go = go;
addEventListener('beforeunload', e => { if (!leaving && st.dirty && !st.trial){ e.preventDefault(); e.returnValue = ''; } });

/* ---------- statistika (anonymní, viz pravidla 13.12) ---------- */
function track(ev){
  if (st.trial && ev !== 'zkusebni_rezim') return;
  const w = innerWidth, dev = w < 768 ? 'telefon' : w < 1280 ? 'tablet' : 'pocitac';
  const rec = { aplikace: C ? C.app : 'hub', udalost: ev, cas: new Date().toISOString(), zarizeni: dev, rezim: theme() };
  try { (S.analytics || (()=>{}))(rec); } catch(e){}
}
S.track = track;

/* ---------- přehled zkratek a novinky ---------- */
function shortcuts(){
  const common = [['Nový','Alt+N'],['Otevřít',MOD+'+O'],['Uložit',MOD+'+S'],['Tisk',MOD+'+P'],['PDF',MOD+'+Shift+P'],['Zpět / Znovu',MOD+'+Z / '+MOD+'+Y'],['Smazat vybrané','Delete'],['Zavřít nabídku nebo okno','Esc'],['Přehled zkratek','?']];
  const row = ([l,k]) => `<span>${esc(l)}</span><span>${k.split(' / ').map(x=>`<kbd>${esc(x)}</kbd>`).join(' ')}</span>`;
  let h = '<div class="s-keys"><h4>Společné</h4>' + common.map(row).join('');
  if (C && C.shortcuts && C.shortcuts.length) h += `<h4>V této aplikaci</h4>` + C.shortcuts.map(s => row([s.label, s.keys])).join('');
  modal({ title:'Klávesové zkratky', body:h + '</div>' });
}
function news(rec){
  const r = rec || A;
  const body = '<div class="s-news">' + (r.changes||[]).slice(0,3).map(c => `<h4>Verze ${esc(c.version)}<small>${esc(new Date(c.date).toLocaleDateString('cs-CZ'))}</small></h4><ul>${c.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`).join('') + '</div>';
  modal({ title:'Co je nového – ' + r.name, body });
  try { ls.setItem('sesta:seen:' + r.id, r.version); } catch(e){}
  const v = $('#sVer'); v && v.classList.remove('new');
}
S.news = news;

/* ---------- vykreslení hlavičky ---------- */
function header(){
  const isHub = C.app === 'hub';
  const rec = A;
  const pdf = (C.actions && C.actions.pdf) || [];
  const h = el(`<header class="s-header">
    <div class="s-brand">
      <button type="button" class="s-tile" aria-label="Rozcestník ŠestaApp" data-tip="${isHub?'ŠestaApp':'Rozcestník'}">${icon(isHub?'brand':rec.icon)}</button>
      <div style="min-width:0">
        <div class="s-title"><span class="s-pre">${esc(S.brand.name)}</span>${isHub?'':` <span class="s-sl s-pre">/</span> ${esc(rec.name)}`} <button type="button" class="s-ver" id="sVer" data-tip="Co je nového">${esc(rec.version)}</button></div>
        <div class="s-sub" id="sSub"></div>
      </div>
      <div class="s-menu s-appmenu" id="sAppMenu" role="menu"></div>
    </div>
    <nav class="s-actions" aria-label="Akce"></nav>
  </header>`);
  const act = h.querySelector('.s-actions');
  if (!isHub){
    act.innerHTML = `
      <button type="button" class="s-ib s-phone-hide" id="sNew" data-tip="Nový" data-key="Alt+N" aria-label="Nový">${icon('new')}</button>
      <button type="button" class="s-ib s-phone-hide" id="sOpen" data-tip="Otevřít" data-key="${MOD}+O" aria-label="Otevřít">${icon('open')}</button>
      <button type="button" class="s-ib" id="sSave" data-tip="Uložit" data-key="${MOD}+S" aria-label="Uložit">${icon('save')}<span class="s-dot" id="sSaveDot" hidden></span></button>
      <span class="s-sep"></span>
      <span class="s-split s-phone-hide ${pdf.length>1?'':'single'}"><button type="button" class="s-ib" id="sPdf" data-tip="${esc(pdf[0]?pdf[0].label:'PDF')}" data-key="${MOD}+Shift+P" aria-label="PDF">${icon('pdf')}</button><button type="button" class="s-car" id="sPdfMore" data-menu data-tip="Další varianty PDF" aria-label="Další varianty PDF">${icon('chev')}</button></span>
      <div class="s-menu" id="sPdfMenu" role="menu"></div>
      <button type="button" class="s-ib s-pri" id="sPrint" data-tip="Tisk" data-key="${MOD}+P" aria-label="Tisk">${icon('print')}</button>
      <span class="s-sep"></span>
      <button type="button" class="s-ib" id="sSet" data-menu data-tip="Nastavení" aria-label="Nastavení">${icon('gear')}</button>
      <div class="s-menu" id="sSetMenu" role="menu"></div>
      <button type="button" class="s-ib s-phone-hide" id="sTheme"></button>`;
  } else {
    act.innerHTML = `<button type="button" class="s-ib" id="sTheme"></button>`;
  }
  doc.body.prepend(el('<div class="s-stripe"></div>'));
  doc.querySelector('.s-stripe').after(h);

  /* nabídka aplikací – najetím (výjimka), klik na logo = rozcestník */
  const brand = h.querySelector('.s-brand'), am = h.querySelector('#sAppMenu');
  am.innerHTML = `<a class="s-am" href="${C.root}" data-nav><span class="s-at home">${icon('home')}</span><span><b>Rozcestník</b><small>Hlavní stránka ${esc(S.brand.name)}</small></span>${isHub?'<span class="s-lbl">otevřeno</span>':''}</a>
    <div class="s-mhr"></div><div class="s-mh">${isHub?'Aplikace':'Přepnout aplikaci'}</div>` +
    S.apps.map(a => a.id === C.app
      ? `<div class="s-am cur"><span class="s-at">${icon(a.icon)}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span><span class="s-lbl">otevřeno</span></div>`
      : `<a class="s-am" href="${C.root + a.path}" data-nav><span class="s-at">${icon(a.icon)}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span></a>`).join('');
  if (isHub) am.querySelector('.s-am').classList.add('cur');
  am.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.getAttribute('href')); }));
  let ot, ct;
  const openAM = () => { clearTimeout(ct); if (openMenu === am) return; ot = setTimeout(() => { closeMenus(); openMenu = am; am.classList.add('open'); brand.classList.add('open'); }, 150); };
  const closeAM = () => { clearTimeout(ot); ct = setTimeout(() => { if (openMenu === am) closeMenus(); }, 300); };
  brand.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') openAM(); });
  brand.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') closeAM(); });
  let touchOpened = false;
  const tile = h.querySelector('.s-tile');
  tile.addEventListener('pointerdown', e => { touchOpened = e.pointerType === 'touch' && openMenu !== am; });
  tile.addEventListener('click', () => {
    if (touchOpened){ touchOpened = false; closeMenus(); openMenu = am; am.classList.add('open'); brand.classList.add('open'); return; }
    if (!isHub) go(C.root); else closeMenus();
  });

  /* verze a novinky */
  const ver = h.querySelector('#sVer');
  try { if ((rec.changes||[]).length && ls.getItem('sesta:seen:' + rec.id) !== rec.version) ver.classList.add('new'); } catch(e){}
  ver.onclick = () => news();

  /* motiv */
  h.querySelector('#sTheme').onclick = () => setTheme(theme() === 'dark' ? 'light' : 'dark');
  setTheme(theme());
  if (isHub) return;

  const A_ = C.actions || {};
  const dis = (id, ok) => { const b = h.querySelector(id); if (!ok){ b.disabled = true; } };
  dis('#sNew', !!A_.new); dis('#sOpen', !!C.load); dis('#sPrint', !!A_.print); dis('#sPdf', pdf.length > 0);
  h.querySelector('#sNew').onclick = doNew;
  h.querySelector('#sOpen').onclick = doOpen;
  h.querySelector('#sSave').onclick = doSave;
  h.querySelector('#sPdf').onclick = () => doPdf(0);
  h.querySelector('#sPrint').onclick = doPrint;
  const pm = h.querySelector('#sPdfMenu');
  fillMenu(pm, pdf.map((v,i) => ({ label:v.label, icon:'pdf', key:i===0?MOD+'+Shift+P':'', run:() => doPdf(i) })));
  h.querySelector('#sPdfMore').onclick = e => toggleMenu(pm, e.currentTarget.parentElement);
  const sm = h.querySelector('#sSetMenu');
  h.querySelector('#sSet').onclick = e => { buildSettings(sm); toggleMenu(sm, e.currentTarget); };
}

/* Nastavení – pevná kostra (pravidla 13.1), na telefonu navíc akce z hlavičky */
function buildSettings(m){
  const items = [];
  if (innerWidth < 768){
    items.push({label:'Nový', icon:'new', run:doNew, disabled:!C.actions.new}, {label:'Otevřít', icon:'open', run:doOpen, disabled:!C.load});
    (C.actions.pdf||[]).forEach((v,i) => items.push({label:v.label, icon:'pdf', run:() => doPdf(i)}));
    items.push({label: theme()==='dark' ? 'Světlý režim' : 'Noční režim', icon: theme()==='dark'?'sun':'moon', run:() => setTheme(theme()==='dark'?'light':'dark')}, '-');
  }
  if (C.trial) items.push(st.trial ? {label:'Ukončit zkušební režim', icon:'flask', on:true, run:() => endTrial()} : {label:'Zkušební režim', icon:'flask', run:startTrial});
  items.push({label:'Klávesové zkratky', icon:'keyboard', key:'?', run:shortcuts});
  const own = (C.settings && C.settings()) || [];
  if (own.length) items.push('-', ...own);
  const danger = (C.danger && C.danger()) || [];
  if (danger.length) items.push('-', ...danger.map(d => ({...d, danger:true})));
  fillMenu(m, items);
}

/* ---------- patička, telefonní lišta, přetažení souboru ---------- */
function footer(){
  const r = A, isHub = C.app === 'hub';
  doc.body.appendChild(el(`<footer class="s-footer"><span><b>${esc(isHub ? S.brand.name : r.name)}</b> · ${esc(r.year)} · verze ${esc(r.version)} · Created by Martin Hejhal.</span></footer>`));
}
function phoneBar(){
  if (innerWidth >= 768 || C.app === 'hub' || ss.getItem('sesta:phone-ok')) return;
  const b = el(`<div class="s-bar phone">${icon('monitor')}<span class="s-grow">Pro pohodlnější práci otevřete aplikaci na počítači nebo tabletu.</span><button type="button" class="s-x" aria-label="Zavřít">${icon('x')}</button></div>`);
  b.querySelector('button').onclick = () => { ss.setItem('sesta:phone-ok','1'); b.remove(); };
  $('.s-header').after(b);
}
function dropZone(){
  if (!C.load) return;
  const z = el('<div class="s-drop">Pusťte soubor sem</div>'); doc.body.appendChild(z);
  let n = 0;
  const hasFile = e => [...(e.dataTransfer && e.dataTransfer.types || [])].includes('Files');
  addEventListener('dragenter', e => { if (!hasFile(e)) return; n++; z.classList.add('show'); });
  addEventListener('dragleave', e => { if (!hasFile(e)) return; if (--n <= 0){ n = 0; z.classList.remove('show'); } });
  addEventListener('dragover', e => { if (hasFile(e)) e.preventDefault(); });
  addEventListener('drop', async e => {
    if (!hasFile(e)) return; e.preventDefault(); n = 0; z.classList.remove('show');
    const f = e.dataTransfer.files[0]; if (!f) return;
    guard(async () => { endTrial(true); receive(await f.text(), f.name); });
  });
}

/* ---------- klávesy ---------- */
function keys(e){
  const typing = /INPUT|TEXTAREA|SELECT/.test((doc.activeElement||{}).tagName||'') || (doc.activeElement && doc.activeElement.isContentEditable);
  const mod = e.ctrlKey || e.metaKey, k = (e.key||'').toLowerCase();
  if (e.key === 'Escape' && openMenu){ closeMenus(); e.preventDefault(); return; }
  if (C.app === 'hub' || doc.querySelector('.s-modal-bg')) return;
  if (mod && !e.shiftKey && k === 's'){ e.preventDefault(); e.stopImmediatePropagation(); doSave(); return; }
  if (mod && !e.shiftKey && k === 'p'){ e.preventDefault(); e.stopImmediatePropagation(); doPrint(); return; }
  if (mod && e.shiftKey && k === 'p'){ e.preventDefault(); e.stopImmediatePropagation(); doPdf(0); return; }
  if (typing) return;
  if (mod && k === 'o'){ e.preventDefault(); e.stopImmediatePropagation(); doOpen(); return; }
  if (e.altKey && !mod && (e.code === 'KeyN')){ e.preventDefault(); e.stopImmediatePropagation(); doNew(); return; }
  if (e.key === '?' ){ e.preventDefault(); shortcuts(); }
}

/* ---------- start ---------- */
S.init = function(cfg){
  C = Object.assign({ actions:{} }, cfg);
  C.root = C.root ?? '../';
  A = C.app === 'hub' ? { id:'hub', name:S.brand.name, icon:'brand', version:S.brand.version, year:S.brand.year, desc:'Aplikace pro pedagogy', changes:[] } : S.apps.find(a => a.id === C.app);
  if (!A) throw new Error('Aplikace ' + C.app + ' není v shared/apps.js');
  doc.body.classList.add('sesta');
  header(); footer(); phoneBar(); dropZone();
  addEventListener('keydown', keys, true);
  addEventListener('resize', () => { tipHide(); });
  if (C.app !== 'hub'){
    /* zkušební režim se při návratu nebo obnovení stránky ukončí – vrátí se vlastní práce */
    if (st.trial) endTrial(true);
    /* soubor předaný z jiné aplikace */
    const inc = ss.getItem('sesta:incoming');
    if (inc){ ss.removeItem('sesta:incoming'); try { const o = JSON.parse(inc); if (o.app === C.app){ C.load(o.data, {name:o.name}); st.dirty = false; st.saved = 'Otevřeno ' + o.name; ss.setItem(K('empty-off'),'1'); toast('Otevřeno: ' + o.name, {kind:'ok'}); } } catch(e){ console.error(e); } }
  }
  refresh(); checkEmpty(); track('otevreni');
  return S;
};
})();
