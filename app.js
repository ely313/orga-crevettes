import { firebaseConfig } from './firebase-config.js';

/* ---------- Les crevettes ---------- */
const PEOPLE = [
  { id: 'myeline', name: 'Myéline', short: 'My', c: '#1B2A5B' },
  { id: 'paupau', name: 'Paupau', short: 'Pa', c: '#8E2A4E' },
  { id: 'mcpauline', name: 'Mc. Pauline', short: 'Mc', c: '#2450C8' },
  { id: 'chacha', name: 'Chacha', short: 'Ca', c: '#8CCBEE', t: '#2A1218' },
  { id: 'chachounette', name: 'Chachounette', short: 'Ch', c: '#6B6B2E' },
  { id: 'lili', name: 'Lili', short: 'Li', c: '#D92B2B' },
  { id: 'cleloche', name: 'Cléloche', short: 'Cl', c: '#E6178A' },
  { id: 'lalo', name: 'Lalo', short: 'La', c: '#1E8C96' },
  { id: 'apopo', name: 'Apopo', short: 'Ap', c: '#D98BA3', t: '#2A1218' },
  { id: 'loulou', name: 'Loulou', short: 'Lo', c: '#F6C9D5', t: '#2A1218' },
];
const ALL_IDS = PEOPLE.map(p => p.id);
const person = id => PEOPLE.find(p => p.id === id) || { id, name: '?', short: '?', c: '#888' };
const MOTIFS = ['bleu', 'pivoine', 'sauge', 'corail', 'ocre', 'lilas'];
const LOGO = 'icons/icon-256.png';

/* ---------- Petits outils ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const safe = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
// Les dates restent en texte local (AAAA-MM-JJ) : pas de décalage de fuseau possible.
const pad = n => String(n).padStart(2, '0');
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => toISO(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return toISO(d); };
const fmt = (s, o) => new Intl.DateTimeFormat('fr-FR', o).format(parse(s));
const dayLong = s => { const t = today(); if (s === t) return "Aujourd'hui, " + fmt(s, { day: 'numeric', month: 'long' }); if (s === addDays(t, 1)) return 'Demain, ' + fmt(s, { day: 'numeric', month: 'long' }); return fmt(s, { weekday: 'long', day: 'numeric', month: 'long' }); };
const dayShort = s => fmt(s, { day: 'numeric', month: 'short' });
const timeOf = at => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(at));
const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;

const I = {
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.7c.6 0 1.2.3 1.6.7l1 1c.4.5 1 .8 1.6.8h5.1A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5a6 6 0 0 0-6 6c0 5-2 6.5-2 6.5h16s-2-1.500-2-6.500a6 6 0 0 0-6-6zM10 19.500a2.200 2.200 0 0 0 4 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8.500" r="3.500"/><path d="M3 20c.5-3.500 3-5.500 6-5.500s5.500 2 6 5.500M16 5.500a3.300 3.300 0 0 1 0 6.200M18 14.800c1.700.7 2.700 2.500 3 5.200"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 6h14M5 11h14M5 16h9"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>',
};
const av = (id, cls = '') => { const p = person(id); return `<span class="av ${cls}" style="--c:${p.c};color:${p.t || '#fff'}" aria-hidden="true">${esc(p.short)}</span>`; };

/* ---------- Mode démo (tant que Firebase n'est pas branché) ---------- */
function demoData() {
  const t = today(), d = n => addDays(t, n), base = { editedBy: null, rsvp: {} };
  return {
    events: [
      { id: 'e1', title: 'Dîner presque parfait', date: d(2), endDate: d(2), allDay: false, start: '19:30', end: '23:00', place: 'Chez Lili', concerned: ALL_IDS, notes: 'Chacune apporte une chose.', addedBy: 'lili', createdAt: Date.now() - 5e6, ...base, rsvp: { lili: 'yes', apopo: 'yes', lalo: 'maybe' } },
      { id: 'e2', title: 'Tournage du vlog', date: d(5), endDate: d(5), allDay: false, start: '14:00', end: '17:00', place: 'Parc de Blossac', concerned: ['myeline', 'paupau', 'lalo', 'loulou'], notes: '', addedBy: 'paupau', createdAt: Date.now() - 3e6, ...base },
      { id: 'e3', title: 'Week-end à la mer', date: d(12), endDate: d(14), allDay: true, start: '', end: '', place: 'La Rochelle', concerned: ALL_IDS, notes: 'Trouver une location pour 10.', addedBy: 'chacha', createdAt: Date.now() - 2e6, ...base },
      { id: 'e5', title: 'Sport du jeudi', date: d(1), endDate: d(1), allDay: false, start: '18:30', end: '20:00', place: 'Gymnase', concerned: ['lili', 'apopo', 'lalo'], notes: '', addedBy: 'apopo', createdAt: Date.now() - 4e6, repeat: 'weekly', until: '', except: [], recurring: true, ...base },
      { id: 'e4', title: 'Café révisions', date: t, endDate: t, allDay: false, start: '17:30', end: '', place: 'BU', concerned: ['cleloche', 'chachounette'], notes: '', addedBy: 'cleloche', createdAt: Date.now() - 1e6, ...base },
    ],
    projects: [
      { id: 'p1', title: 'Week-end à la mer', motif: 'bleu', notes: 'Budget à fixer ensemble.', eventId: 'e3', addedBy: 'chacha', createdAt: Date.now() - 2e6, editedBy: null },
      { id: 'p2', title: 'Anniversaire surprise', motif: 'pivoine', notes: '', eventId: null, addedBy: 'mcpauline', createdAt: Date.now() - 1e6, editedBy: null },
    ],
    tasks: [
      { id: 't1', projectId: 'p1', title: 'Réserver la location', assignee: 'chacha', due: d(4), done: false, addedBy: 'chacha', createdAt: 1 },
      { id: 't2', projectId: 'p1', title: 'Organiser le covoiturage', assignee: 'apopo', due: d(9), done: false, addedBy: 'chacha', createdAt: 2 },
      { id: 't3', projectId: 'p1', title: 'Comparer les prix', assignee: 'lili', due: '', done: true, addedBy: 'chacha', createdAt: 3 },
      { id: 't4', projectId: 'p2', title: 'Acheter le cadeau', assignee: 'loulou', due: d(7), done: false, addedBy: 'mcpauline', createdAt: 4 },
    ],
    activity: [
      { id: 'a1', who: 'cleloche', verb: 'a ajouté', title: 'Café révisions', kind: 'event', ref: 'e4', at: Date.now() - 1e6 },
      { id: 'a2', who: 'chacha', verb: 'a ajouté', title: 'Week-end à la mer', kind: 'event', ref: 'e3', at: Date.now() - 2e6 },
      { id: 'a3', who: 'lili', verb: 'a ajouté', title: 'Dîner presque parfait', kind: 'event', ref: 'e1', at: Date.now() - 5e6 },
    ],
  };
}
function createDemoStore() {
  let raw = null; try { raw = JSON.parse(safe.get('crevettes-demo')); } catch {}
  const data = raw || demoData();
  let notify = () => {};
  const flush = () => { safe.set('crevettes-demo', JSON.stringify(data)); notify({ ...data }); };
  const clean = c => { data[c] = [...data[c]]; };
  let accounts = {}; try { accounts = JSON.parse(safe.get('crevettes-demo-codes')) || {}; } catch {}
  let onAuth = () => {};
  const signed = id => { safe.set('crevettes-demo-moi', id || ''); onAuth(id); };
  const auth = {
    onChange(cb) { onAuth = cb; const id = safe.get('crevettes-demo-moi'); cb(ALL_IDS.includes(id) ? id : null); },
    async isClaimed(id) { return !!accounts[id]; },
    async signUp(id, code) { if (accounts[id]) throw { code: 'auth/email-already-in-use' }; accounts[id] = code; safe.set('crevettes-demo-codes', JSON.stringify(accounts)); signed(id); },
    async signIn(id, code) { if (accounts[id] !== code) throw { code: 'auth/invalid-credential' }; signed(id); },
    async changeCode(code) { accounts[S.me] = code; safe.set('crevettes-demo-codes', JSON.stringify(accounts)); },
    async signOut() { safe.set('crevettes-demo-moi', ''); },
  };
  return {
    shared: false, auth,
    subscribe(cb) { notify = cb; cb({ ...data }); },
    extendWindow() {},
    async set(c, id, v) { clean(c); data[c] = data[c].filter(x => x.id !== id).concat({ id, ...v }); flush(); },
    async update(c, id, v) {
      clean(c);
      data[c] = data[c].map(x => {
        if (x.id !== id) return x;
        const n = JSON.parse(JSON.stringify(x));
        for (const [k, val] of Object.entries(v)) { const p = k.split('.'); let o = n; p.slice(0, -1).forEach(a => { o[a] = o[a] || {}; o = o[a]; }); o[p[p.length - 1]] = val; }
        return n;
      });
      flush();
    },
    async remove(c, id) { clean(c); data[c] = data[c].filter(x => x.id !== id); flush(); },
  };
}

/* ---------- État ---------- */
const now = new Date();
const S = {
  me: null, authReady: false, login: null, tab: 'agenda', agendaMode: 'mois', orgMode: 'sujets',
  y: now.getFullYear(), m: now.getMonth(), sel: today(), filter: 'all',
  data: { events: [], projects: [], tasks: [], activity: [] }, loaded: false, error: null,
  seen: Number(safe.get('crevettes-vu') || 0), online: navigator.onLine,
};
let store;
const root = document.getElementById('root'), sheetsEl = document.getElementById('sheets'), toastEl = document.getElementById('toast');
const failed = e => { console.error(e); toast("Enregistrement refusé. Vérifie ta connexion puis réessaie."); };
const write = p => { Promise.resolve(p).catch(failed); }; // hors ligne, la promesse attend le réseau : on n'attend pas pour fermer le formulaire.
const log = (verb, kind, ref, title) => { const id = uid(); write(store.set('activity', id, { who: S.me, verb, kind, ref, title, at: Date.now() })); };

/* ---------- Récurrence ---------- */
const REPEATS = { daily: 'Chaque jour', weekly: 'Chaque semaine', biweekly: 'Toutes les 2 semaines', monthly: 'Chaque mois', yearly: 'Chaque année' };
const dayDiff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const duration = e => dayDiff(e.date, e.endDate || e.date);
// Les mois sans ce jour (un 31, par exemple) sont sautés, comme dans Calendrier sur iPhone.
function isOccurrence(e, s) {
  if (!e.repeat) return s === e.date;
  if (s < e.date || (e.until && s > e.until) || (e.except || []).includes(s)) return false;
  const n = dayDiff(e.date, s), a = parse(e.date), b = parse(s);
  return { daily: true, weekly: n % 7 === 0, biweekly: n % 14 === 0, monthly: a.getDate() === b.getDate(), yearly: a.getDate() === b.getDate() && a.getMonth() === b.getMonth() }[e.repeat] || false;
}
const instance = (e, s) => (e.repeat ? { ...e, seriesDate: e.date, occ: s, date: s, endDate: addDays(s, duration(e)) } : e);
function occurrences(e, from, max, days) {
  const out = [], start = from > e.date ? from : e.date;
  for (let i = 0, d = start; i < days && out.length < max; i++, d = addDays(d, 1)) if (isOccurrence(e, d)) out.push(d);
  return out;
}
const nextOcc = e => occurrences(e, addDays(today(), -duration(e)), 1, 800)[0] || e.date;
const isCurrent = e => !!e.repeat ? occurrences(e, today(), 1, 800).length > 0 : (e.endDate || e.date) >= today();
const rsvpOf = e => (e.repeat ? (e.rsvpOcc || {})[e.occ] || {} : e.rsvp || {});

/* ---------- Agenda ---------- */
const evSort = (a, b) => (a.allDay === b.allDay ? (a.start || '').localeCompare(b.start || '') : a.allDay ? -1 : 1) || a.title.localeCompare(b.title);
const visible = () => S.data.events.filter(e => S.filter === 'all' || (e.concerned || []).includes(S.filter));
function onDay(list, d) {
  const out = [];
  for (const e of list) {
    if (!e.repeat) { if (e.date <= d && (e.endDate || e.date) >= d) out.push(e); continue; }
    for (let k = 0, dur = duration(e); k <= dur; k++) { const s = addDays(d, -k); if (isOccurrence(e, s)) { out.push(instance(e, s)); break; } }
  }
  return out.sort(evSort);
}
function evCard(e) {
  const multi = e.endDate && e.endDate !== e.date;
  const time = e.allDay ? 'Journée' : esc(e.start);
  const concerned = e.concerned || [];
  const names = concerned.length === 10 ? '<span>Toutes</span>' : `<span class="stack">${concerned.slice(0, 5).map(i => av(i, 's')).join('')}</span>${concerned.length > 5 ? `<span>+${concerned.length - 5}</span>` : ''}`;
  return `<button class="ev" data-act="openEvent" data-id="${e.id}" data-occ="${e.occ || ''}" style="--c:${person(e.addedBy).c}">
    <span class="ev-time">${time}${!e.allDay && e.end ? `<small>${esc(e.end)}</small>` : ''}</span><span class="ev-bar"></span>
    <span class="ev-main"><span class="ev-title">${esc(e.title)}</span>
      ${e.place || multi || e.repeat ? `<span class="ev-sub">${[e.place && esc(e.place), multi && `jusqu'au ${dayShort(e.endDate)}`, e.repeat && `↻ ${REPEATS[e.repeat]}`].filter(Boolean).join(' · ')}</span>` : ''}
      <span class="ev-by">Ajouté par ${esc(person(e.addedBy).name)}<span class="sp"></span>${names}</span></span></button>`;
}
function monthView() {
  const first = new Date(S.y, S.m, 1), offset = (first.getDay() + 6) % 7;
  const start = addDays(toISO(first), -offset), weeks = Math.ceil((offset + new Date(S.y, S.m + 1, 0).getDate()) / 7);
  const t = today(), list = visible(); let cells = '';
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(start, i), dt = parse(d), evs = onDay(list, d), out = dt.getMonth() !== S.m;
    const seen = [...new Set(evs.map(e => e.addedBy))], dots = seen.slice(0, 3).map(a => `<i style="--c:${person(a).c}"></i>`).join('') + (evs.length > 3 ? '<b>+</b>' : '');
    const label = fmt(d, { weekday: 'long', day: 'numeric', month: 'long' }) + (evs.length ? `, ${plural(evs.length, 'événement')}` : '');
    cells += `<button class="day ${out ? 'out' : ''} ${d === t ? 'today' : ''} ${d === S.sel ? 'sel' : ''}" data-act="pickDay" data-d="${d}" aria-label="${esc(label)}"><span class="n">${dt.getDate()}</span><span class="dots">${dots}</span></button>`;
  }
  const evs = onDay(list, S.sel);
  return `<div class="month" id="month"><div class="dow">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span>${x}</span>`).join('')}</div><div class="days">${cells}</div></div>
    <h2 class="sec-title">${esc(dayLong(S.sel))}</h2>
    ${evs.length ? `<div class="list">${evs.map(evCard).join('')}</div>` : `<div class="empty"><span>Rien de prévu ce jour-là.</span><button class="link" data-act="newEvent" data-d="${S.sel}">Ajouter quelque chose</button></div>`}`;
}
function upcomingView() {
  const t = today(), list = [];
  for (const e of visible()) {
    // 8 dates maximum par série, sur un an, pour que la liste reste lisible.
    if (e.repeat) { for (const s of occurrences(e, addDays(t, -duration(e)), 8, 366)) { const i = instance(e, s); list.push({ e: i, k: s < t ? t : s }); } }
    else if ((e.endDate || e.date) >= t) list.push({ e, k: e.date < t ? t : e.date });
  }
  list.sort((a, b) => a.k.localeCompare(b.k) || evSort(a.e, b.e));
  if (!list.length) return emptyAgenda();
  let html = '', cur = null;
  for (const { e, k } of list) { if (k !== cur) { html += `${cur ? '</div>' : ''}<h2 class="sec-title">${esc(dayLong(k))}</h2><div class="list">`; cur = k; } html += evCard(e); }
  return html + '</div>';
}
const emptyAgenda = () => `<div class="empty"><img src="${LOGO}" alt=""><strong>L'agenda est vide</strong><span>Ajoute le premier rendez-vous : il apparaîtra chez tout le monde.</span><button class="link" data-act="newEvent">Ajouter un rendez-vous</button></div>`;
function agendaScreen() {
  const label = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(S.y, S.m, 1));
  const title = S.agendaMode === 'mois'
    ? `<div class="title-row"><h1 class="large">${label[0].toUpperCase() + label.slice(1)} <small>${S.y}</small></h1>${S.sel !== today() || S.m !== now.getMonth() || S.y !== now.getFullYear() ? `<button class="link" data-act="goToday">Aujourd'hui</button>` : ''}<button class="round" data-act="prevMonth" aria-label="Mois précédent">${I.left}</button><button class="round" data-act="nextMonth" aria-label="Mois suivant">${I.right}</button></div>`
    : `<h1 class="large">À venir</h1>`;
  const chip = (id, content, cls = '') => `<button class="fchip ${cls}" data-act="setFilter" data-id="${id}" aria-pressed="${S.filter === id}">${content}</button>`;
  const others = PEOPLE.filter(p => p.id !== S.me);
  return `<header class="top">${brandRow()}${title}<div class="seg" role="group" aria-label="Affichage"><button data-act="agendaMode" data-v="mois" aria-pressed="${S.agendaMode === 'mois'}">Mois</button><button data-act="agendaMode" data-v="liste" aria-pressed="${S.agendaMode === 'liste'}">À venir</button></div></header>
  <div class="filters" aria-label="Voir ce qui concerne">${chip('all', 'Toutes', 'text')}${chip(S.me, av(S.me, 's') + 'Moi')}${others.map(p => chip(p.id, av(p.id, 's') + esc(p.name))).join('')}</div>
  <main class="scroll" id="scroll">${banner()}${S.agendaMode === 'mois' ? monthView() : upcomingView()}</main>`;
}
const brandRow = () => `<div class="top-row"><img class="top-logo" src="${LOGO}" alt=""><span class="brand">Orga des crevettes</span><button data-act="profile" aria-label="Mon compte, ${esc(person(S.me).name)}">${av(S.me)}</button></div>`;
function banner() {
  const b = [];
  if (!store.shared) b.push('<strong>Mode démo.</strong> Exemples fictifs, gardés sur cet appareil seulement. Le partage démarre une fois Firebase branché.');
  if (!S.online) b.push("<strong>Hors connexion.</strong> Tes ajouts partiront au retour du réseau.");
  if (S.error) b.push(esc(S.error));
  return b.map(x => `<div class="banner">${x}</div>`).join('');
}

/* ---------- Organisation ---------- */
const tasksOf = id => S.data.tasks.filter(t => t.projectId === id).sort((a, b) => (a.done - b.done) || (a.due || '9').localeCompare(b.due || '9') || (a.createdAt - b.createdAt));
function folderCard(p) {
  const ts = tasksOf(p.id), done = ts.filter(t => t.done).length, ev = S.data.events.find(e => e.id === p.eventId);
  return `<button class="folder m-${esc(p.motif || 'bleu')}-t" data-act="openProject" data-id="${p.id}" style="background:none">
    <div class="f-back m-${esc(p.motif || 'bleu')}" style="background-image:none"></div>
    <div class="f-front motif m-${esc(p.motif || 'bleu')}"><div class="f-label"><strong>${esc(p.title)}</strong>
    <span class="f-meta"><span>${ts.length ? `${done}/${ts.length} ${ts.length > 1 ? 'tâches' : 'tâche'}` : 'Aucune tâche'}</span><span>${ev ? dayShort(ev.repeat ? nextOcc(ev) : ev.date) : ''}</span></span>
    <span class="bar"><i style="width:${ts.length ? Math.round(100 * done / ts.length) : 0}%"></i></span></div></div></button>`;
}
function taskRow(t, showProject) {
  const late = t.due && !t.done && t.due < today(), proj = showProject && S.data.projects.find(p => p.id === t.projectId);
  const bits = [proj && esc(proj.title), t.due && (late ? 'En retard : ' : '') + dayShort(t.due)].filter(Boolean).join(' · ');
  return `<div class="task ${t.done ? 'done' : ''}"><button class="check" role="checkbox" aria-checked="${!!t.done}" aria-label="${t.done ? 'Rouvrir' : 'Terminer'} : ${esc(t.title)}" data-act="toggleTask" data-id="${t.id}">${I.check}</button>
    <button class="task-main" data-act="${showProject ? 'openProject' : 'editTask'}" data-id="${showProject ? t.projectId : t.id}"><strong>${esc(t.title)}</strong>${bits ? `<small class="${late ? 'late' : ''}">${bits}</small>` : ''}</button>${t.assignee ? av(t.assignee, '') : ''}</div>`;
}
function orgScreen() {
  let body;
  if (S.orgMode === 'sujets') {
    const ps = [...S.data.projects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    body = ps.length ? `<div class="folders">${ps.map(folderCard).join('')}</div>` : `<div class="empty"><img src="${LOGO}" alt=""><strong>Rien à organiser pour l'instant</strong><span>Crée un dossier à la main, ou pars d'un rendez-vous de l'agenda.</span><button class="link" data-act="newProjectMenu">Créer un dossier</button></div>`;
  } else {
    const mine = S.data.tasks.filter(t => t.assignee === S.me).sort((a, b) => (a.done - b.done) || (a.due || '9').localeCompare(b.due || '9'));
    body = mine.length ? `<div class="group">${mine.map(t => taskRow(t, true)).join('')}</div>` : `<div class="empty"><strong>Aucune tâche pour toi</strong><span>Les tâches qui te sont confiées s'afficheront ici.</span></div>`;
  }
  return `<header class="top">${brandRow()}<h1 class="large">Organisation</h1><div class="seg" role="group" aria-label="Affichage"><button data-act="orgMode" data-v="sujets" aria-pressed="${S.orgMode === 'sujets'}">Dossiers</button><button data-act="orgMode" data-v="taches" aria-pressed="${S.orgMode === 'taches'}">Mes tâches</button></div></header>
  <main class="scroll" id="scroll">${banner()}${body}</main>`;
}

/* ---------- Activité ---------- */
function activityScreen() {
  const list = [...S.data.activity].sort((a, b) => b.at - a.at);
  let html = '', cur = null;
  for (const a of list) {
    const d = toISO(new Date(a.at));
    if (d !== cur) { html += `${cur ? '</div>' : ''}<h2 class="sec-title">${esc(dayLong(d))}</h2><div class="group">`; cur = d; }
    html += `<button class="act" data-act="openActivity" data-kind="${esc(a.kind)}" data-ref="${esc(a.ref)}">${av(a.who)}<span class="act-t"><strong>${esc(person(a.who).name)}</strong> ${esc(a.verb)} <strong>${esc(a.title)}</strong><small>${timeOf(a.at)}</small></span></button>`;
  }
  if (cur) html += '</div>';
  return `<header class="top">${brandRow()}<h1 class="large">Activité</h1></header><main class="scroll" id="scroll">${banner()}${html || `<div class="empty"><img src="${LOGO}" alt=""><strong>Aucune activité</strong><span>Chaque ajout ou modification s'affichera ici, avec le nom de son autrice.</span></div>`}</main>`;
}

/* ---------- Écran principal ---------- */
function welcome() {
  return `<div class="welcome"><div class="welcome-band motif m-pivoine"></div><div class="welcome-in"><img class="welcome-logo" src="${LOGO}" alt="Logo : une crevette souriante"><h1>Orga des crevettes</h1><p>Qui es-tu ? Chaque ajout portera ton prénom.</p>
  <div class="who-grid">${PEOPLE.map(p => `<button class="who-btn" data-act="chooseMe" data-id="${p.id}">${av(p.id, 'l')}<span>${esc(p.name)}</span></button>`).join('')}</div></div></div>`;
}
function loginScreen() {
  const { id, mode, error } = S.login, p = person(id), isNew = mode === 'new';
  return `<div class="welcome"><div class="welcome-band motif m-pivoine"></div><form class="welcome-in" data-form="login" novalidate>
    <span style="margin-top:-30px;display:flex">${av(id, 'xl')}</span><h1>${esc(p.name)}</h1>
    <p>${mode === 'wait' ? 'Un instant…' : isNew ? "C'est ta première connexion. Choisis ton code : il te sera demandé sur chaque nouvel appareil." : 'Entre ton code.'}</p>
    ${!store.shared ? '<div class="banner">Démo : le code reste sur cet appareil. Ne mets pas un vrai code.</div>' : ''}
    ${mode === 'wait' ? '' : `<div class="login-fields"><input type="text" name="username" value="${esc(p.name)}" autocomplete="username" hidden>
    <div class="fgroup"><label for="l-code">${isNew ? 'Ton code (6 caractères minimum)' : 'Code'}</label><input id="l-code" class="input" type="password" name="code" autocomplete="${isNew ? 'new-password' : 'current-password'}"></div>
    ${isNew ? '<div class="fgroup"><label for="l-code2">Confirme ton code</label><input id="l-code2" class="input" type="password" name="code2" autocomplete="new-password"></div>' : ''}
    ${error ? `<div class="err">${esc(error)}</div>` : ''}
    <button class="btn primary" type="submit">${isNew ? 'Créer mon code' : 'Me connecter'}</button>
    ${isNew ? '' : '<p class="hint">Code oublié ? Demande à celle qui gère le projet Firebase de le réinitialiser.</p>'}</div>`}
    <button class="link" type="button" data-act="backToNames">Ce n'est pas moi</button></form></div>`;
}
function authMessage(e) {
  const c = e?.code || '';
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-login-credentials'].includes(c)) return 'Code incorrect.';
  if (c === 'auth/too-many-requests') return "Trop d'essais. Attends quelques minutes puis réessaie.";
  if (c === 'auth/network-request-failed' || c === 'unavailable') return 'Pas de réseau. Il en faut pour se connecter.';
  if (c === 'auth/weak-password' || c === 'auth/password-does-not-meet-requirements') return 'Ce code est trop simple. Choisis-en un autre.';
  if (c === 'auth/operation-not-allowed') return "La connexion par code n'est pas encore activée dans Firebase (LISEZ-MOI, étape 1).";
  if (c === 'auth/requires-recent-login') return "Par sécurité, déconnecte-toi, reconnecte-toi, puis change ton code.";
  return 'Connexion impossible pour le moment. Réessaie.';
}
function render() {
  if (!S.authReady) { root.innerHTML = ''; return; }
  if (!S.me) { root.innerHTML = S.login ? loginScreen() : welcome(); return; }
  const scrollTop = document.getElementById('scroll')?.scrollTop || 0;
  const filterScroll = root.querySelector('.filters')?.scrollLeft || 0;
  const unread = S.data.activity.filter(a => a.at > S.seen && a.who !== S.me).length;
  const screen = S.tab === 'agenda' ? agendaScreen() : S.tab === 'orga' ? orgScreen() : activityScreen();
  const tab = (id, label, icon, extra = '') => `<button class="tab" data-act="setTab" data-v="${id}" ${S.tab === id ? 'aria-current="page"' : ''}>${icon}<span>${label}</span>${extra}</button>`;
  root.innerHTML = screen + `${S.tab !== 'activite' ? `<button class="fab" data-act="${S.tab === 'agenda' ? 'newEvent' : 'newProjectMenu'}" ${S.tab === 'agenda' ? `data-d="${S.sel}"` : ''} aria-label="${S.tab === 'agenda' ? 'Ajouter un rendez-vous' : 'Créer un dossier'}">${I.plus}</button>` : ''}
  <nav class="tabs"><div class="tabs-in">${tab('agenda', 'Agenda', I.cal)}${tab('orga', 'Organisation', I.folder)}${tab('activite', 'Activité', I.bell, unread && S.tab !== 'activite' ? `<span class="badge">${unread}</span>` : '')}</div></nav>`;
  const sc = document.getElementById('scroll'); if (sc) sc.scrollTop = scrollTop;
  const fl = root.querySelector('.filters'); if (fl) fl.scrollLeft = filterScroll;
  const m = document.getElementById('month');
  if (m) { let x0 = null; m.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true }); m.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 55) moveMonth(dx < 0 ? 1 : -1); x0 = null; }, { passive: true }); }
}
function moveMonth(n) {
  const d = new Date(S.y, S.m + n, 1); S.y = d.getFullYear(); S.m = d.getMonth();
  const t = today(); S.sel = (d.getFullYear() === parse(t).getFullYear() && d.getMonth() === parse(t).getMonth()) ? t : toISO(d);
  store.extendWindow(addDays(toISO(d), -7)); render();
}

/* ---------- Feuilles ---------- */
const stack = [];
function openSheet(type, args = {}) { const el = document.createElement('div'); el.className = 'sheet-wrap'; sheetsEl.appendChild(el); const s = { type, args, el }; stack.push(s); paintSheet(s); el.querySelector('.sheet')?.focus?.(); }
function closeSheet() { const s = stack.pop(); if (s) s.el.remove(); }
function closeAll() { while (stack.length) closeSheet(); }
function paintSheet(s) { const html = SHEETS[s.type](s.args); if (html === null) { const i = stack.indexOf(s); if (i >= 0) stack.splice(i, 1); s.el.remove(); return; } const top = s.el.querySelector('.sheet-body')?.scrollTop || 0; s.el.innerHTML = `<div class="backdrop" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" style="${s.painted ? 'animation:none' : ''}" tabindex="-1">${html}</div>`; s.painted = true; const b = s.el.querySelector('.sheet-body'); if (b) b.scrollTop = top; }
const nav = (title, left, right = '') => `<div class="sheet-nav"><div class="nav-side">${left}</div><h2>${esc(title)}</h2><div class="nav-side end">${right}</div></div>`;
const closeBtn = (label = 'Fermer') => `<button class="nav-btn" data-act="closeSheet">${label}</button>`;
const pickOne = (name, sel) => `<div class="pick" data-pick="${name}" data-single="1">${PEOPLE.map(p => `<button type="button" data-pv="${p.id}" aria-pressed="${p.id === sel}">${av(p.id, 's')}${esc(p.name)}</button>`).join('')}</div>`;
const pickMany = (name, sel) => `<div class="pick" data-pick="${name}"><button type="button" class="text" data-pall="1" aria-pressed="${sel.length === 10}">Toutes</button>${PEOPLE.map(p => `<button type="button" data-pv="${p.id}" aria-pressed="${sel.includes(p.id)}">${av(p.id, 's')}${esc(p.name)}</button>`).join('')}</div>`;
const names = ids => `<span class="names">${ids.map(i => `<span class="name">${av(i, 's')}${esc(person(i).name)}</span>`).join('')}</span>`;
function whenText(e) {
  const multi = e.endDate && e.endDate !== e.date;
  if (e.allDay) return multi ? `Du ${dayLong(e.date)} au ${dayLong(e.endDate)}` : `${dayLong(e.date)}, toute la journée`;
  return multi ? `Du ${dayLong(e.date)} à ${e.start} au ${dayLong(e.endDate)}${e.end ? ` à ${e.end}` : ''}` : `${dayLong(e.date)}, ${e.start}${e.end ? ` – ${e.end}` : ''}`;
}
const motifFor = id => MOTIFS[ALL_IDS.indexOf(id) % MOTIFS.length] || 'bleu';
const SHEETS = {
  event({ id, occ }) {
    const base = S.data.events.find(x => x.id === id); if (!base) return null;
    if (base.repeat && occ && !isOccurrence(base, occ)) return null;
    const e = base.repeat ? instance(base, occ || nextOcc(base)) : base;
    const rsvp = rsvpOf(e), mine = rsvp[S.me];
    const by = v => Object.keys(rsvp).filter(k => rsvp[k] === v);
    const proj = S.data.projects.find(p => p.eventId === e.id);
    const answers = [['yes', 'Viennent'], ['maybe', 'Peut-être'], ['no', 'Ne viennent pas']].filter(([v]) => by(v).length).map(([v, l]) => `<div class="row"><div class="row-main"><small>${l} (${by(v).length})</small>${names(by(v))}</div></div>`).join('');
    return nav('', closeBtn(), `<button class="nav-btn" data-act="editEvent" data-id="${e.id}" data-occ="${e.occ || ''}">Modifier</button>`) + `<div class="sheet-body">
      <div class="hero motif m-${motifFor(e.addedBy)}"></div><h1 class="d-title">${esc(e.title)}</h1>
      <div class="group"><div class="row">${I.clock}<div class="row-main">${esc(whenText(e))}${e.repeat ? `<small>↻ ${REPEATS[e.repeat]}${e.until ? ` jusqu'au ${dayShort(e.until)}` : ''}</small>` : ''}</div></div>
      ${e.place ? `<div class="row">${I.pin}<div class="row-main">${esc(e.place)}</div></div>` : ''}
      <div class="row">${I.people}<div class="row-main"><small>Concerne</small>${(e.concerned || []).length === 10 ? 'Toutes les crevettes' : names(e.concerned || [])}</div></div>
      ${e.notes ? `<div class="row">${I.note}<div class="row-main">${esc(e.notes)}</div></div>` : ''}
      <div class="row">${av(e.addedBy, 's')}<div class="row-main"><small>Ajouté par</small>${esc(person(e.addedBy).name)}${e.editedBy ? `<small>Modifié en dernier par ${esc(person(e.editedBy).name)}</small>` : ''}</div></div></div>
      <div class="stack-v"><div class="flabel">Ta réponse${e.repeat ? ` pour le ${dayShort(e.occ)}` : ''}, ${esc(person(S.me).name)}</div><div class="rsvp" role="group">${[['yes', 'Je viens'], ['maybe', 'Peut-être'], ['no', 'Je ne viens pas']].map(([v, l]) => `<button data-act="rsvp" data-id="${e.id}" data-occ="${e.occ || ''}" data-v="${v}" aria-pressed="${mine === v}">${l}</button>`).join('')}</div></div>
      ${answers ? `<div class="group">${answers}</div>` : ''}
      <button class="btn primary" data-act="${proj ? 'openProject' : 'organize'}" data-id="${proj ? proj.id : e.id}">${I.folder}${proj ? 'Voir son dossier' : 'Organiser ça'}</button>
      <button class="btn danger" data-act="askDeleteEvent" data-id="${e.id}" data-occ="${e.occ || ''}">Supprimer ce rendez-vous</button></div>`;
  },
  eventForm({ id, date, occ, scope }) {
    const found = id ? S.data.events.find(x => x.id === id) : null; const d = date || S.sel || today();
    const e = found && scope === 'one' ? instance(found, occ) : found;
    const v = e || { title: '', date: d, endDate: d, allDay: false, start: '', end: '', place: '', notes: '', concerned: [S.me], addedBy: S.me };
    return `<form data-form="event" data-id="${id || ''}" data-scope="${scope || ''}" data-occ="${occ || ''}" novalidate style="display:contents">` + nav(scope === 'one' ? `Modifier le ${dayShort(occ)}` : id ? 'Modifier' : 'Nouveau rendez-vous', closeBtn('Annuler'), `<button class="nav-btn strong" type="submit">${id ? 'OK' : 'Ajouter'}</button>`) + `<div class="sheet-body">
      <div class="fgroup"><label for="f-title">Titre <em>*</em></label><input id="f-title" class="input" name="title" maxlength="120" value="${esc(v.title)}" placeholder="Ex. Dîner chez Lili" autocomplete="off"></div>
      <div class="switch-row"><span id="ad">Toute la journée</span><button type="button" class="switch" role="switch" aria-labelledby="ad" aria-checked="${!!v.allDay}" data-act="toggleAllDay"></button><input type="hidden" name="allDay" value="${v.allDay ? 1 : ''}"></div>
      <div class="two"><div class="fgroup"><label for="f-date">Début <em>*</em></label><input id="f-date" class="input" type="date" name="date" value="${esc(v.date)}"></div><div class="fgroup"><label for="f-end">Fin</label><input id="f-end" class="input" type="date" name="endDate" value="${esc(v.endDate || v.date)}"></div></div>
      <div class="two" data-times ${v.allDay ? 'hidden' : ''}><div class="fgroup"><label for="f-st">Heure de début <em>*</em></label><input id="f-st" class="input" type="time" name="start" value="${esc(v.start)}"></div><div class="fgroup"><label for="f-en">Heure de fin</label><input id="f-en" class="input" type="time" name="end" value="${esc(v.end)}"></div></div>
      ${scope === 'one' ? '' : `<div class="two"><div class="fgroup"><label for="f-rep">Répéter</label><select id="f-rep" class="input" name="repeat" data-repeat><option value="">Jamais</option>${Object.entries(REPEATS).map(([k, l]) => `<option value="${k}" ${v.repeat === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="fgroup" data-until ${v.repeat ? '' : 'hidden'}><label for="f-until">Jusqu'au (facultatif)</label><input id="f-until" class="input" type="date" name="until" value="${esc(v.until || '')}"></div></div>
      <p class="hint" data-monthly ${v.repeat === 'monthly' ? '' : 'hidden'}>Si ce jour n'existe pas dans un mois (un 31, par exemple), ce mois est sauté.</p>`}
      <div class="fgroup"><label for="f-place">Où</label><input id="f-place" class="input" name="place" maxlength="200" value="${esc(v.place)}" placeholder="Lieu" autocomplete="off"></div>
      <div class="fgroup"><span class="flabel">Ça concerne qui ? <em>*</em></span>${pickMany('concerned', v.concerned || [])}</div>
      <div class="fgroup"><label for="f-notes">Notes</label><textarea id="f-notes" class="input" name="notes" maxlength="3000">${esc(v.notes)}</textarea></div>
      ${id ? `<div class="fgroup"><span class="flabel">Ajouté par</span><div class="switch-row"><span class="name">${av(v.addedBy, 's')}${esc(person(v.addedBy).name)}</span></div></div>` : `<div class="fgroup"><span class="flabel">Ajouté par</span><div class="switch-row"><span class="name">${av(S.me, 's')}${esc(person(S.me).name)}</span></div></div>`}
      <div class="err" data-err hidden></div></div></form>`;
  },
  project({ id }) {
    const p = S.data.projects.find(x => x.id === id); if (!p) return null;
    const ts = tasksOf(p.id), done = ts.filter(t => t.done).length, ev = S.data.events.find(e => e.id === p.eventId);
    return nav('', closeBtn(), `<button class="nav-btn" data-act="editProject" data-id="${p.id}">Modifier</button>`) + `<div class="sheet-body">
      <div class="hero motif m-${esc(p.motif || 'bleu')}"></div><h1 class="d-title">${esc(p.title)}</h1>
      <div class="group">${ev ? `<button class="row tap" data-act="openEvent" data-id="${ev.id}" data-occ="${ev.repeat ? nextOcc(ev) : ''}">${I.cal}<div class="row-main"><small>Rendez-vous lié</small>${esc(ev.title)} · ${esc(dayLong(ev.repeat ? nextOcc(ev) : ev.date))}${ev.repeat ? `<small>↻ ${REPEATS[ev.repeat]}</small>` : ''}</div></button>` : ''}
      ${p.notes ? `<div class="row">${I.note}<div class="row-main">${esc(p.notes)}</div></div>` : ''}
      <div class="row">${av(p.addedBy, 's')}<div class="row-main"><small>Créé par</small>${esc(person(p.addedBy).name)}${p.editedBy ? `<small>Modifié en dernier par ${esc(person(p.editedBy).name)}</small>` : ''}</div></div></div>
      <div class="stack-v"><div class="flabel">Tâches${ts.length ? ` : ${done} sur ${ts.length} terminée${done > 1 ? 's' : ''}` : ''}</div>${ts.length ? `<div class="bar"><i style="width:${Math.round(100 * done / ts.length)}%"></i></div><div class="group">${ts.map(t => taskRow(t)).join('')}</div>` : ''}
      <button class="btn" data-act="newTask" data-id="${p.id}">${I.plus}Ajouter une tâche</button></div>
      <button class="btn danger" data-act="askDeleteProject" data-id="${p.id}">Supprimer ce dossier</button></div>`;
  },
  projectForm({ id, eventId, title }) {
    const p = id ? S.data.projects.find(x => x.id === id) : null;
    const v = p || { title: title || '', motif: MOTIFS[S.data.projects.length % MOTIFS.length], notes: '', eventId: eventId || '', addedBy: S.me };
    const upcoming = S.data.events.filter(e => isCurrent(e) || e.id === v.eventId).sort((a, b) => a.date.localeCompare(b.date));
    return `<form data-form="project" data-id="${id || ''}" novalidate style="display:contents">` + nav(id ? 'Modifier' : 'Nouveau dossier', closeBtn('Annuler'), `<button class="nav-btn strong" type="submit">${id ? 'OK' : 'Créer'}</button>`) + `<div class="sheet-body">
      <div class="fgroup"><label for="p-title">Nom du dossier <em>*</em></label><input id="p-title" class="input" name="title" maxlength="120" value="${esc(v.title)}" placeholder="Ex. Week-end à la mer" autocomplete="off"></div>
      <div class="fgroup"><span class="flabel">Motif</span><div class="mpick" data-pick="motif" data-single="1">${MOTIFS.map(m => `<button type="button" class="motif m-${m}" data-pv="${m}" aria-label="Motif ${m}" aria-pressed="${m === v.motif}"></button>`).join('')}</div></div>
      <div class="fgroup"><label for="p-ev">Rendez-vous lié</label><select id="p-ev" class="input" name="eventId"><option value="">Aucun</option>${upcoming.map(e => `<option value="${e.id}" ${e.id === v.eventId ? 'selected' : ''}>${esc(e.title)} (${e.repeat ? REPEATS[e.repeat].toLowerCase() : dayShort(e.date)})</option>`).join('')}</select></div>
      <div class="fgroup"><label for="p-notes">Notes</label><textarea id="p-notes" class="input" name="notes" maxlength="3000">${esc(v.notes)}</textarea></div>
      ${id ? `<div class="fgroup"><span class="flabel">Créé par</span><div class="switch-row"><span class="name">${av(v.addedBy, 's')}${esc(person(v.addedBy).name)}</span></div></div>` : `<div class="fgroup"><span class="flabel">Créé par</span><div class="switch-row"><span class="name">${av(S.me, 's')}${esc(person(S.me).name)}</span></div></div>`}
      <div class="err" data-err hidden></div></div></form>`;
  },
  projectMenu() {
    return nav('Nouveau dossier', closeBtn('Annuler')) + `<div class="sheet-body"><button class="btn" data-act="newProject">${I.plus}Créer à la main</button><div class="flabel">Ou piocher dans l'agenda</div>${SHEETS.pickList()}</div>`;
  },
  pickList() {
    const list = S.data.events.filter(e => isCurrent(e) && !S.data.projects.some(p => p.eventId === e.id)).sort((a, b) => a.date.localeCompare(b.date));
    return list.length ? `<div class="group">${list.map(e => `<button class="row tap" data-act="organize" data-id="${e.id}">${I.cal}<div class="row-main">${esc(e.title)}<small>${esc(e.repeat ? REPEATS[e.repeat] + ', prochain : ' + dayLong(nextOcc(e)) : dayLong(e.date))}</small></div></button>`).join('')}</div>` : '<div class="empty"><span>Aucun rendez-vous à venir sans dossier.</span></div>';
  },
  taskForm({ id, projectId }) {
    const t = id ? S.data.tasks.find(x => x.id === id) : null;
    const v = t || { title: '', assignee: '', due: '', addedBy: S.me };
    return `<form data-form="task" data-id="${id || ''}" data-project="${esc(projectId || t?.projectId)}" novalidate style="display:contents">` + nav(id ? 'Modifier la tâche' : 'Nouvelle tâche', closeBtn('Annuler'), `<button class="nav-btn strong" type="submit">${id ? 'OK' : 'Ajouter'}</button>`) + `<div class="sheet-body">
      <div class="fgroup"><label for="t-title">Tâche <em>*</em></label><input id="t-title" class="input" name="title" maxlength="120" value="${esc(v.title)}" placeholder="Ex. Réserver la location" autocomplete="off"></div>
      <div class="fgroup"><span class="flabel">Qui s'en occupe ?</span>${pickOne('assignee', v.assignee)}</div>
      <div class="fgroup"><label for="t-due">Échéance</label><input id="t-due" class="input" type="date" name="due" value="${esc(v.due)}"></div>
      ${id ? `<div class="fgroup"><span class="flabel">Ajoutée par</span><div class="switch-row"><span class="name">${av(v.addedBy, 's')}${esc(person(v.addedBy).name)}</span></div></div><button type="button" class="btn danger" data-act="deleteTask" data-id="${id}">Supprimer cette tâche</button>` : `<div class="fgroup"><span class="flabel">Ajoutée par</span><div class="switch-row"><span class="name">${av(S.me, 's')}${esc(person(S.me).name)}</span></div></div>`}
      <div class="err" data-err hidden></div></div></form>`;
  },
  editChoice({ id, occ }) {
    return nav('Modifier', closeBtn('Annuler')) + `<div class="sheet-body"><p class="confirm-txt">Ce rendez-vous se répète. Que veux-tu modifier ?</p><div class="stack-v">
      <button class="btn" data-act="editOne" data-id="${id}" data-occ="${occ}">Seulement le ${esc(dayShort(occ))}</button><button class="btn" data-act="editAll" data-id="${id}">Toute la série</button></div></div>`;
  },
  deleteChoice({ id, occ }) {
    const e = S.data.events.find(x => x.id === id); if (!e) return null;
    return nav('Supprimer', closeBtn('Annuler')) + `<div class="sheet-body"><p class="confirm-txt">« ${esc(e.title)} » se répète. Que veux-tu supprimer pour tout le monde ?</p><div class="stack-v">
      <button class="btn" data-act="deleteOcc" data-id="${id}" data-occ="${occ}">Seulement le ${esc(dayShort(occ))}</button>
      ${occ !== e.date ? `<button class="btn" data-act="deleteFollowing" data-id="${id}" data-occ="${occ}">Le ${esc(dayShort(occ))} et les suivants</button>` : ''}
      <button class="btn primary" data-act="deleteEvent" data-id="${id}">Toute la série</button></div></div>`;
  },
  confirm({ text, act, id, label }) {
    return nav('Confirmer', closeBtn('Annuler')) + `<div class="sheet-body"><p class="confirm-txt">${esc(text)}</p><button class="btn primary" data-act="${act}" data-id="${id}">${esc(label)}</button></div>`;
  },
  profile() {
    return nav('Mon compte', closeBtn()) + `<div class="sheet-body"><div class="group"><div class="row">${av(S.me)}<div class="row-main">${esc(person(S.me).name)}<small>Connectée sur cet appareil</small></div></div></div>
      <button class="btn" data-act="changeCodeForm">Changer mon code</button><button class="btn danger" data-act="logout">Me déconnecter</button></div>`;
  },
  codeForm() {
    return `<form data-form="code" novalidate style="display:contents">` + nav('Changer mon code', closeBtn('Annuler'), '<button class="nav-btn strong" type="submit">OK</button>') + `<div class="sheet-body">
      <div class="fgroup"><label for="c-code">Nouveau code (6 caractères minimum)</label><input id="c-code" class="input" type="password" name="code" autocomplete="new-password"></div>
      <div class="fgroup"><label for="c-code2">Confirme ton code</label><input id="c-code2" class="input" type="password" name="code2" autocomplete="new-password"></div>
      <div class="err" data-err hidden></div></div></form>`;
  },
};

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg, undo) {
  clearTimeout(toastTimer);
  toastEl.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button id="undo">Annuler</button>' : ''}`; toastEl.hidden = false;
  if (undo) toastEl.querySelector('#undo').onclick = () => { undo(); toastEl.hidden = true; };
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, undo ? 7000 : 3200);
}
const strip = ({ id, ...rest }) => rest;

/* ---------- Actions ---------- */
const A = {
  async chooseMe(b) {
    const id = b.dataset.id; S.login = { id, mode: 'wait' }; render();
    try { const claimed = await store.auth.isClaimed(id); if (S.login?.id === id) { S.login.mode = claimed ? 'code' : 'new'; render(); root.querySelector('#l-code')?.focus(); } }
    catch (e) { console.error(e); S.login = null; render(); toast(authMessage(e)); }
  },
  backToNames() { S.login = null; render(); },
  changeCodeForm() { openSheet('codeForm'); },
  async logout() { await store.auth.signOut(); location.reload(); },
  profile() { openSheet('profile'); },
  setTab(b) { S.tab = b.dataset.v; if (S.tab === 'activite') { S.seen = Date.now(); safe.set('crevettes-vu', S.seen); } const sc = document.getElementById('scroll'); if (sc) sc.scrollTop = 0; render(); if (document.getElementById('scroll')) document.getElementById('scroll').scrollTop = 0; },
  agendaMode(b) { S.agendaMode = b.dataset.v; render(); },
  orgMode(b) { S.orgMode = b.dataset.v; render(); },
  setFilter(b) { S.filter = S.filter === b.dataset.id ? 'all' : b.dataset.id; render(); },
  pickDay(b) { S.sel = b.dataset.d; const d = parse(S.sel); if (d.getMonth() !== S.m || d.getFullYear() !== S.y) { S.y = d.getFullYear(); S.m = d.getMonth(); store.extendWindow(addDays(toISO(new Date(S.y, S.m, 1)), -7)); } render(); },
  prevMonth() { moveMonth(-1); }, nextMonth() { moveMonth(1); },
  goToday() { const n = new Date(); S.y = n.getFullYear(); S.m = n.getMonth(); S.sel = today(); render(); },
  closeSheet() { closeSheet(); },
  openEvent(b) { openSheet('event', { id: b.dataset.id, occ: b.dataset.occ || '' }); },
  newEvent(b) { openSheet('eventForm', { date: b.dataset.d || today() }); },
  editEvent(b) { if (b.dataset.occ) openSheet('editChoice', { id: b.dataset.id, occ: b.dataset.occ }); else openSheet('eventForm', { id: b.dataset.id }); },
  editOne(b) { const { id, occ } = b.dataset; closeSheet(); openSheet('eventForm', { id, occ, scope: 'one' }); },
  editAll(b) { const { id } = b.dataset; closeSheet(); openSheet('eventForm', { id }); },
  toggleAllDay(b) { const on = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', on); const f = b.closest('form'); f.elements.allDay.value = on ? 1 : ''; f.querySelector('[data-times]').hidden = on; },
  rsvp(b) {
    const base = S.data.events.find(x => x.id === b.dataset.id); if (!base) return;
    const v = b.dataset.v, occ = base.repeat ? b.dataset.occ : '', cur = rsvpOf(occ ? instance(base, occ) : base)[S.me];
    // Une seule case est écrite : deux réponses envoyées en même temps ne s'écrasent pas.
    write(store.update('events', base.id, { [occ ? `rsvpOcc.${occ}.${S.me}` : `rsvp.${S.me}`]: cur === v ? null : v }));
    if (cur !== v) log({ yes: 'vient à', maybe: 'viendra peut-être à', no: 'ne vient pas à' }[v], 'event', base.id, occ ? `${base.title} (${dayShort(occ)})` : base.title);
  },
  deleteOcc(b) {
    const e = S.data.events.find(x => x.id === b.dataset.id), occ = b.dataset.occ; closeSheet(); closeSheet(); if (!e) return;
    write(store.update('events', e.id, { except: [...(e.except || []), occ], editedBy: S.me })); log(`a supprimé le ${dayShort(occ)} de`, 'event', e.id, e.title);
    toast('Date supprimée', () => write(store.set('events', e.id, strip(e))));
  },
  deleteFollowing(b) {
    const e = S.data.events.find(x => x.id === b.dataset.id), occ = b.dataset.occ; closeSheet(); closeSheet(); if (!e) return;
    write(store.update('events', e.id, { until: addDays(occ, -1), editedBy: S.me })); log(`a supprimé à partir du ${dayShort(occ)}`, 'event', e.id, e.title);
    toast('Dates suivantes supprimées', () => write(store.set('events', e.id, strip(e))));
  },
  askDeleteEvent(b) { if (b.dataset.occ) { openSheet('deleteChoice', { id: b.dataset.id, occ: b.dataset.occ }); return; } const e = S.data.events.find(x => x.id === b.dataset.id); openSheet('confirm', { text: `Supprimer « ${e.title} » pour tout le monde ?`, act: 'deleteEvent', id: e.id, label: 'Supprimer' }); },
  deleteEvent(b) {
    const e = S.data.events.find(x => x.id === b.dataset.id); closeSheet(); closeSheet(); if (!e) return;
    write(store.remove('events', e.id)); log('a supprimé', 'none', '', e.title);
    toast('Rendez-vous supprimé', () => { write(store.set('events', e.id, strip(e))); log('a restauré', 'event', e.id, e.title); });
  },
  organize(b) {
    const e = S.data.events.find(x => x.id === b.dataset.id); if (!e) return;
    openSheet('projectForm', { eventId: e.id, title: e.title });
  },
  newProjectMenu() { openSheet('projectMenu'); },
  newProject() { closeSheet(); openSheet('projectForm', {}); },
  openProject(b) { openSheet('project', { id: b.dataset.id }); },
  editProject(b) { openSheet('projectForm', { id: b.dataset.id }); },
  askDeleteProject(b) { const p = S.data.projects.find(x => x.id === b.dataset.id); const n = tasksOf(p.id).length; openSheet('confirm', { text: `Supprimer « ${p.title} »${n ? ` et ses ${plural(n, 'tâche')}` : ''} pour tout le monde ?`, act: 'deleteProject', id: p.id, label: 'Supprimer' }); },
  deleteProject(b) {
    const p = S.data.projects.find(x => x.id === b.dataset.id); closeSheet(); closeSheet(); if (!p) return;
    const ts = tasksOf(p.id); write(store.remove('projects', p.id)); ts.forEach(t => write(store.remove('tasks', t.id))); log('a supprimé', 'none', '', p.title);
    toast('Dossier supprimé', () => { write(store.set('projects', p.id, strip(p))); ts.forEach(t => write(store.set('tasks', t.id, strip(t)))); log('a restauré', 'project', p.id, p.title); });
  },
  newTask(b) { openSheet('taskForm', { projectId: b.dataset.id }); },
  editTask(b) { openSheet('taskForm', { id: b.dataset.id }); },
  toggleTask(b) { const t = S.data.tasks.find(x => x.id === b.dataset.id); if (!t) return; write(store.update('tasks', t.id, { done: !t.done })); log(t.done ? 'a rouvert' : 'a terminé', 'project', t.projectId, t.title); },
  deleteTask(b) { const t = S.data.tasks.find(x => x.id === b.dataset.id); closeSheet(); if (!t) return; write(store.remove('tasks', t.id)); log('a supprimé', 'project', t.projectId, t.title); toast('Tâche supprimée', () => write(store.set('tasks', t.id, strip(t)))); },
  openActivity(b) { const { kind, ref } = b.dataset; if (kind === 'event' && S.data.events.some(e => e.id === ref)) openSheet('event', { id: ref, occ: '' }); else if (kind === 'project' && S.data.projects.some(p => p.id === ref)) openSheet('project', { id: ref }); else if (kind !== 'none') toast('Cet élément a été supprimé, ou est trop ancien pour être chargé.'); },
};
document.addEventListener('click', e => {
  const pv = e.target.closest('[data-pv],[data-pall]');
  if (pv) {
    const box = pv.closest('[data-pick]');
    if (box.dataset.single) { const was = pv.getAttribute('aria-pressed') === 'true'; box.querySelectorAll('[data-pv]').forEach(x => x.setAttribute('aria-pressed', 'false')); if (!was || box.dataset.pick !== 'assignee') pv.setAttribute('aria-pressed', 'true'); return; }
    if (pv.dataset.pall) { const on = pv.getAttribute('aria-pressed') !== 'true'; box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', on)); return; }
    pv.setAttribute('aria-pressed', pv.getAttribute('aria-pressed') !== 'true');
    box.querySelector('[data-pall]').setAttribute('aria-pressed', box.querySelectorAll('[data-pv][aria-pressed="true"]').length === 10);
    return;
  }
  const b = e.target.closest('[data-act]'); if (b && A[b.dataset.act]) { e.preventDefault(); A[b.dataset.act](b); }
});
document.addEventListener('change', e => {
  if (!e.target.matches?.('[data-repeat]')) return;
  const f = e.target.closest('form');
  f.querySelector('[data-until]').hidden = !e.target.value;
  f.querySelector('[data-monthly]').hidden = e.target.value !== 'monthly';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && stack.length) closeSheet(); });
const picked = (f, n) => [...f.querySelectorAll(`[data-pick="${n}"] [data-pv][aria-pressed="true"]`)].map(x => x.dataset.pv);
function fail(f, msg, focus) { const el = f.querySelector('[data-err]'); el.textContent = msg; el.hidden = false; el.scrollIntoView?.({ block: 'nearest' }); if (focus) f.elements[focus]?.focus(); }
const SUBMIT = {
  async login(f) {
    const { id, mode } = S.login, code = f.elements.code.value;
    const err = m => { S.login.error = m; render(); root.querySelector('#l-code')?.focus(); };
    if (mode === 'new') {
      if (code.length < 6) return err('Ton code doit faire au moins 6 caractères.');
      if (code !== f.elements.code2.value) return err('Les deux codes ne sont pas identiques.');
      try { await store.auth.signUp(id, code); }
      catch (e) { if (e?.code === 'auth/email-already-in-use') { S.login = { id, mode: 'code', error: 'Ce prénom a déjà un code. Entre-le ici.' }; render(); return; } console.error(e); err(authMessage(e)); }
    } else {
      if (!code) return err('Entre ton code.');
      try { await store.auth.signIn(id, code); } catch (e) { console.error(e); err(authMessage(e)); }
    }
  },
  async code(f) {
    const code = f.elements.code.value;
    if (code.length < 6) return fail(f, 'Ton code doit faire au moins 6 caractères.', 'code');
    if (code !== f.elements.code2.value) return fail(f, 'Les deux codes ne sont pas identiques.', 'code2');
    try { await store.auth.changeCode(code); closeAll(); toast('Code changé'); } catch (e) { console.error(e); fail(f, authMessage(e)); }
  },
  event(f, id) {
    const g = n => f.elements[n].value.trim(), allDay = !!g('allDay'), title = g('title'), date = g('date');
    let endDate = g('endDate') || date; const start = allDay ? '' : g('start'), end = allDay ? '' : g('end');
    const concerned = picked(f, 'concerned');
    if (!title) return fail(f, 'Donne un titre à ce rendez-vous.', 'title');
    if (!date) return fail(f, 'Choisis une date de début.', 'date');
    if (endDate < date) return fail(f, 'La date de fin doit suivre la date de début.', 'endDate');
    if (!allDay && !start) return fail(f, "Indique l'heure de début, ou active « Toute la journée ».", 'start');
    if (!allDay && end && endDate === date && end <= start) return fail(f, "L'heure de fin doit suivre l'heure de début.", 'end');
    if (!concerned.length) return fail(f, 'Choisis au moins une personne concernée.');
    const base = { title, date, endDate, allDay, start, end, place: g('place'), notes: g('notes'), concerned };
    if (f.dataset.scope === 'one') {
      // Une date modifiée devient un rendez-vous à part, et quitte la série.
      const s = S.data.events.find(x => x.id === id), occ = f.dataset.occ, nid = uid();
      write(store.set('events', nid, { ...base, addedBy: s.addedBy, editedBy: S.me, rsvp: (s.rsvpOcc || {})[occ] || {}, createdAt: Date.now() }));
      write(store.update('events', id, { except: [...(s.except || []), occ], editedBy: S.me }));
      log('a modifié', 'event', nid, title); closeSheet(); toast('Date modifiée'); return;
    }
    const repeat = g('repeat'), until = repeat ? g('until') : '';
    if (until && until < date) return fail(f, 'La date « Jusqu\'au » doit suivre la date de début.', 'until');
    Object.assign(base, { repeat, until, recurring: !!repeat });
    if (id) { write(store.update('events', id, { ...base, editedBy: S.me })); log('a modifié', 'event', id, title); closeSheet(); toast('Rendez-vous modifié'); return; }
    const addedBy = S.me;
    const nid = uid(); write(store.set('events', nid, { ...base, addedBy, editedBy: null, rsvp: {}, createdAt: Date.now() }));
    log('a ajouté', 'event', nid, title);
    closeSheet(); S.sel = date; const d = parse(date); S.y = d.getFullYear(); S.m = d.getMonth(); render(); toast(store.shared ? 'Ajouté pour tout le monde' : 'Ajouté (démo, sur cet appareil)');
  },
  project(f, id) {
    const title = f.elements.title.value.trim(), motif = picked(f, 'motif')[0] || 'bleu', eventId = f.elements.eventId.value || null, notes = f.elements.notes.value.trim();
    if (!title) return fail(f, 'Donne un nom à ce dossier.', 'title');
    if (id) { write(store.update('projects', id, { title, motif, eventId, notes, editedBy: S.me })); log('a modifié', 'project', id, title); closeSheet(); return; }
    const addedBy = S.me;
    const nid = uid(); write(store.set('projects', nid, { title, motif, eventId, notes, addedBy, editedBy: null, createdAt: Date.now() }));
    log('a créé le dossier', 'project', nid, title);
    closeSheet(); S.tab = 'orga'; S.orgMode = 'sujets'; closeAll(); render(); openSheet('project', { id: nid });
  },
  task(f, id) {
    const title = f.elements.title.value.trim(), assignee = picked(f, 'assignee')[0] || '', due = f.elements.due.value;
    if (!title) return fail(f, 'Décris la tâche.', 'title');
    if (id) { write(store.update('tasks', id, { title, assignee, due, editedBy: S.me })); log('a modifié', 'project', f.dataset.project, title); closeSheet(); return; }
    const addedBy = S.me;
    write(store.set('tasks', uid(), { projectId: f.dataset.project, title, assignee, due, done: false, addedBy, createdAt: Date.now() }));
    log('a ajouté', 'project', f.dataset.project, title);
    closeSheet();
  },
};
document.addEventListener('submit', e => { const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); SUBMIT[f.dataset.form](f, f.dataset.id); });

/* ---------- Démarrage ---------- */
function onData(d) {
  S.data = d; S.loaded = true; S.error = null;
  if (S.tab === 'activite') { S.seen = Date.now(); safe.set('crevettes-vu', S.seen); }
  render();
  [...stack].forEach(s => { if (!/Form$|confirm|Menu/.test(s.type)) paintSheet(s); }); // Les formulaires en cours ne sont jamais écrasés.
}
async function boot() {
  if (firebaseConfig && firebaseConfig.projectId) {
    const [sdk, { createFirebaseStore }] = await Promise.all([import('./firebase-bundle.js'), import('./firebase-store.js')]);
    store = createFirebaseStore(sdk, firebaseConfig);
  } else store = createDemoStore();
  const start = addDays(today(), -92); // 3 mois en arrière ; le reste se charge quand on remonte le calendrier.
  let started = false;
  const subscribe = () => store.subscribe(onData, e => { console.error(e); S.error = e.code === 'permission-denied' ? 'La base refuse la lecture : vérifie les règles de sécurité (LISEZ-MOI, étape 2).' : "Connexion à la base impossible pour l'instant."; render(); }, start);
  store.auth.onChange(id => {
    S.authReady = true; S.me = id; if (id) S.login = null;
    render();
    if (id && !started) { started = true; subscribe(); }
  });
  const refresh = () => { S.online = navigator.onLine; render(); };
  addEventListener('online', refresh); addEventListener('offline', refresh);
  if ('serviceWorker' in navigator && location.protocol === 'https:') { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch {} }
}
boot();
