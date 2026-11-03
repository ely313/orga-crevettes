// Lien avec la base partagée : chaque modification arrive en direct chez les 10 crevettes.
export function createFirebaseStore(sdk, config, opts = {}) {
  const { initializeApp, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, doc, setDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, orderBy, limit, getDoc, getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, signOut } = sdk;
  const app = initializeApp(config, opts.appName);
  let db;
  try { db = initializeFirestore(app, opts.settings || { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch { db = initializeFirestore(app, {}); }
  if (opts.afterInit) opts.afterInit(db);
  const authApi = getAuth(app);
  // Le prénom sert d'identifiant : ces adresses techniques ne reçoivent jamais de message.
  const DOMAIN = '@crevettes.example.com';
  const auth = {
    onChange: cb => onAuthStateChanged(authApi, u => cb(u ? u.email.split('@')[0] : null)),
    isClaimed: async id => (await getDoc(doc(db, 'comptes', id))).exists(),
    async signUp(id, code) {
      await createUserWithEmailAndPassword(authApi, id + DOMAIN, code);
      await setDoc(doc(db, 'comptes', id), { createdAt: Date.now() });
    },
    signIn: (id, code) => signInWithEmailAndPassword(authApi, id + DOMAIN, code),
    changeCode: code => updatePassword(authApi.currentUser, code),
    signOut: () => signOut(authApi),
  };
  const data = { events: [], recurring: [], projects: [], tasks: [], activity: [] };
  let notify = () => {}, onError = () => {}, windowStart = null;
  // Juste après la connexion, Firebase peut refuser une lecture le temps de reconnaître le compte.
  // On réessaie donc quelques fois avant d'afficher une erreur.
  const stops = {}, gens = {};
  // Une série qui a commencé il y a longtemps reste chargée, même hors de la fenêtre de 3 mois.
  const emit = () => {
    const events = new Map();
    [...data.events, ...data.recurring].forEach(e => events.set(e.id, e));
    notify({ ...data, events: [...events.values()] });
  };
  function listen(name, q, tries = 0) {
    if (stops[name]) stops[name]();
    const gen = (gens[name] = (gens[name] || 0) + 1);
    stops[name] = onSnapshot(q, s => { data[name] = s.docs.map(d => ({ id: d.id, ...d.data() })); emit(); }, e => {
      if (gen !== gens[name]) return;
      console.error('Lecture refusée :', name, 'essai', tries + 1, e.code);
      if (e.code === 'permission-denied' && tries < 4) { setTimeout(() => { if (gen === gens[name]) listen(name, q, tries + 1); }, 1000 * (tries + 1)); return; }
      onError(e);
    });
  }
  function listenEvents() {
    listen('events', query(collection(db, 'events'), where('endDate', '>=', windowStart)));
  }
  return {
    shared: true, auth,
    subscribe(cb, err, start) {
      notify = cb; onError = err || onError; windowStart = start;
      listenEvents();
      listen('recurring', query(collection(db, 'events'), where('recurring', '==', true)));
      listen('projects', collection(db, 'projects'));
      listen('tasks', collection(db, 'tasks'));
      listen('activity', query(collection(db, 'activity'), orderBy('at', 'desc'), limit(40)));
    },
    extendWindow(date) { if (date < windowStart) { windowStart = date; listenEvents(); } },
    set: (c, id, v) => setDoc(doc(db, c, id), v),
    update: (c, id, v) => updateDoc(doc(db, c, id), v),
    remove: (c, id) => deleteDoc(doc(db, c, id)),
  };
}
