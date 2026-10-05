(() => {
  'use strict';
  const STORAGE_KEY = 'samenThuisTestV1';
  const pages = {
    today: { title: 'Vandaag', heading: 'Goedemorgen, Kees & Daphne', subtitle: 'Een rustig overzicht van wat vandaag belangrijk is.', description: 'Een overzicht van je dag, focus en taken.' },
    agenda: { title: 'Agenda', heading: 'Onze agenda', subtitle: 'Afspraken en plannen op één plek.', description: 'Hier bouwen we de agenda en weekweergave op, met ruimte voor Kees, Daphne en Samen.' },
    tasks: { title: 'Taken', heading: 'Taken die bij ons passen', subtitle: 'Een flexibele planning die meebeweegt met jullie leven.', description: 'Hier komt de universele takenpagina met persoonlijke en gezamenlijke taken, flexibele herhaling, taakroulatie en herinneringen.' },
    challenges: { title: 'Challenges', heading: 'Samen een uitdaging aan?', subtitle: 'Kleine gewoontes, leuke uitdagingen en beloningen.', description: 'Gamification voor het hele leven: sporten, lezen, leren, elkaar uitdagen, streaks, punten en beloningen — niet alleen voor huishoudelijke taken.' },
    mealplan: { title: 'Weekmenu', heading: 'Wat eten we deze week?', subtitle: 'Lekker plannen zonder elke dag opnieuw te hoeven bedenken.', description: 'Hier komt het weekmenu met recepten, voorkeuren en koppeling aan de boodschappenlijst.' },
    groceries: { title: 'Boodschappen', heading: 'Boodschappenlijst', subtitle: 'Alles wat we nodig hebben, overzichtelijk bij elkaar.', description: 'Hier bouwen we gedeelde boodschappenlijsten, categorieën en koppeling met het weekmenu en de voorraad.' },
    stock: { title: 'Voorraad', heading: 'Wat hebben we in huis?', subtitle: 'Minder vergeten en minder verspillen.', description: 'Hier komt voorraadbeheer met hoeveelheden, houdbaarheid en verbinding met recepten en boodschappen.' },
    home: { title: 'Woning', heading: 'Ons huis', subtitle: 'Onderhoud, administratie en verbeteringen op één plek.', description: 'Hier komt woningadministratie, onderhoud, documenten en terugkerende controles.' },
    budget: { title: 'Budget', heading: 'Onze financiën', subtitle: 'Grip op uitgaven en ruimte voor onze doelen.', description: 'Hier komt het financiële dashboard met werkelijke uitgaven, potjes, buffers en spaardoelen.' },
    dates: { title: 'Date ideeën', heading: 'Tijd voor elkaar', subtitle: 'Ideeën om samen iets leuks te doen.', description: 'Hier komen date-ideeën, wensenlijstjes, verrassingen en het inwisselen van verdiende punten voor gezamenlijke beloningen.' },
    travel: { title: 'Reizen', heading: 'Onze reizen', subtitle: 'Plannen, bewaren en uitkijken naar nieuwe avonturen.', description: 'Hier komt reisplanning met ideeën, budgetten, reserveringen en paklijsten.' },
    extras: { title: 'Extra', heading: 'Alles voor erbij', subtitle: 'Ruimte voor ideeën, routines en persoonlijke projecten.', description: 'Hier komen aanvullende hulpmiddelen, routines, persoonlijke doelen, zoekfunctie en de documentenkluis.' },
    settings: { title: 'Instellingen', heading: 'Zo willen we Samen Thuis gebruiken', subtitle: 'De app afstemmen op ons huishouden.', description: 'Hier komen voorkeuren, personen, export/import en opslagbeheer. Deze testversie gebruikt alleen lokale opslag en heeft geen Supabase-verbinding.' }
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const defaultState = () => ({ tasks: [], focus: '', ideas: [], bannerDismissed: false });
  let state = loadState();
  let currentPage = 'today';

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return parsed && typeof parsed === 'object' ? { ...defaultState(), ...parsed } : defaultState();
    } catch (error) { console.warn('Lokale gegevens konden niet worden gelezen.', error); return defaultState(); }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch (error) { console.error('Opslaan mislukt.', error); toast('Opslaan lukt niet. Controleer de browseropslag.'); return false; }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function toast(message) {
    const region = $('#toast-region');
    const item = document.createElement('div'); item.className = 'toast'; item.textContent = message;
    region.append(item); window.setTimeout(() => item.remove(), 2600);
  }
  function renderTasks() {
    const list = $('#task-list');
    if (!state.tasks.length) list.innerHTML = '<li class="empty-state focus-current">Je testlijst is nog leeg. Voeg hierboven een taak toe.</li>';
    else list.innerHTML = state.tasks.map(task => `<li class="task-row ${task.done ? 'is-done' : ''}" data-task-id="${escapeHTML(task.id)}"><input class="task-check" type="checkbox" aria-label="Taak afronden" ${task.done ? 'checked' : ''}><span class="task-label">${escapeHTML(task.title)}</span><button class="task-delete" type="button" aria-label="Taak verwijderen" title="Taak verwijderen">×</button></li>`).join('');
    const open = state.tasks.filter(task => !task.done).length;
    $('#task-count').textContent = `${state.tasks.length} ${state.tasks.length === 1 ? 'taak' : 'taken'} · ${open} open`;
  }
  function renderFocus() {
    const el = $('#focus-current');
    if (state.focus) { el.classList.remove('empty-state'); el.textContent = `✦  ${state.focus}`; }
    else { el.classList.add('empty-state'); el.textContent = 'Er is nog geen focus gekozen.'; }
    $('#focus-input').value = state.focus;
  }
  function render() {
    const page = pages[currentPage] || pages.today;
    $('#breadcrumb-current').textContent = page.title;
    $('#page-title').textContent = page.heading;
    $('#page-subtitle').textContent = page.subtitle;
    const date = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    $('#today-date').textContent = currentPage === 'today' ? date.toLocaleUpperCase('nl-NL') : 'SAMEN THUIS';
    const isToday = currentPage === 'today';
    $('#today-dashboard').classList.toggle('hidden', !isToday);
    $('#placeholder-page').classList.toggle('hidden', isToday);
    $('#placeholder-title').textContent = page.title;
    $('#placeholder-description').textContent = page.description;
    $$('[data-page-link]').forEach(button => {
      const active = button.dataset.pageLink === currentPage;
      button.classList.toggle('is-active', active);
      if (button.tagName === 'BUTTON') button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    $('#prototype-banner')?.classList.toggle('hidden', state.bannerDismissed);
    const banner = $('.prototype-banner'); if (banner) banner.classList.toggle('hidden', state.bannerDismissed);
    renderTasks(); renderFocus();
  }
  function goTo(pageId) {
    if (!pages[pageId]) return;
    currentPage = pageId;
    closeMenu();
    render();
    $('#page-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function addTask(title) {
    const clean = title.trim(); if (!clean) return false;
    state.tasks.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: clean, done: false, createdAt: new Date().toISOString() });
    saveState(); renderTasks(); toast('Testtaak toegevoegd'); return true;
  }
  function openQuickAdd() { $('#quick-add-dialog').showModal(); }
  function closeMenu() { $('.sidebar').classList.remove('is-open'); $('#mobile-scrim').classList.remove('is-visible'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); }
  function toggleMenu() {
    const open = $('.sidebar').classList.toggle('is-open'); $('#mobile-scrim').classList.toggle('is-visible', open); $('#menu-toggle').setAttribute('aria-expanded', String(open));
  }
  function handleNavigation(event) {
    const button = event.target.closest('[data-page-link]');
    if (button) { event.preventDefault(); goTo(button.dataset.pageLink); }
  }
  document.addEventListener('click', handleNavigation);
  $('#task-form').addEventListener('submit', event => {
    event.preventDefault(); const input = $('#task-input'); if (addTask(input.value)) input.value = '';
  });
  $('#task-add-open').addEventListener('click', () => { $('#task-input').focus(); $('#task-input').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#task-list').addEventListener('change', event => {
    if (!event.target.matches('.task-check')) return;
    const row = event.target.closest('[data-task-id]'); const task = state.tasks.find(item => item.id === row.dataset.taskId);
    if (task) { task.done = event.target.checked; saveState(); renderTasks(); toast(task.done ? 'Taak afgerond ✓' : 'Taak weer open'); }
  });
  $('#task-list').addEventListener('click', event => {
    const button = event.target.closest('.task-delete'); if (!button) return;
    const row = button.closest('[data-task-id]'); state.tasks = state.tasks.filter(task => task.id !== row.dataset.taskId); saveState(); renderTasks(); toast('Taak verwijderd');
  });
  $('#focus-form').addEventListener('submit', event => {
    event.preventDefault(); state.focus = $('#focus-input').value.trim(); saveState(); renderFocus(); toast(state.focus ? 'Focus bewaard' : 'Focus gewist');
  });
  $('#quick-add-open').addEventListener('click', openQuickAdd);
  $('#menu-toggle').addEventListener('click', toggleMenu);
  $('#mobile-scrim').addEventListener('click', closeMenu);
  $('#banner-dismiss').addEventListener('click', () => { state.bannerDismissed = true; saveState(); const banner = $('.prototype-banner'); if (banner) banner.classList.add('hidden'); });
  $('#quick-add-dialog').addEventListener('click', event => {
    const action = event.target.closest('[data-quick-action]')?.dataset.quickAction; if (!action) return;
    $('#quick-add-dialog').close();
    if (action === 'task') { goTo('today'); $('#task-input').focus(); $('#task-input').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (action === 'focus') { goTo('today'); $('#focus-input').focus(); $('#focus-input').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (action === 'idea') { const idea = window.prompt('Bewaar een idee voor later:'); if (idea && idea.trim()) { state.ideas.unshift({ text: idea.trim(), createdAt: new Date().toISOString() }); saveState(); toast('Idee lokaal bewaard'); } }
  });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  render();
})();
