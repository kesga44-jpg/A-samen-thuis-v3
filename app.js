/* ====== APP INITIALIZATION & STORAGE ====== */
const STORAGE_KEY = 'samenThuisV1';
const PAGES = [
  'today', 'agenda', 'tasks', 'challenges', 'mealplan', 'groceries',
  'stock', 'home', 'budget', 'dates', 'travel', 'extras', 'settings'
];

let state = loadState();

/* ====== DOM QUERY HELPERS ====== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ====== STATE MANAGEMENT ====== */
function defaultState() {
  return {
    tasks: [],
    focus: '',
    meals: [],
    ideas: [],
    currentPage: 'today'
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    toast('Opgeslagen');
    return true;
  } catch (e) {
    toast('Opslag vol of niet beschikbaar');
    return false;
  }
}

/* ====== NAVIGATION ====== */
function showPage(pageName) {
  if (!PAGES.includes(pageName)) pageName = 'today';
  
  $$('.page-view').forEach(p => p.classList.remove('is-active'));
  $(`#page-${pageName}`).classList.add('is-active');
  
  $$('.nav-item').forEach(n => n.classList.remove('is-active'));
  $(`.nav-item[data-page-link="${pageName}"]`).classList.add('is-active');
  
  $$('.mobile-nav-item').forEach(n => n.classList.remove('is-active'));
  $(`.mobile-nav-item[data-page-link="${pageName}"]`).classList.add('is-active');
  
  state.currentPage = pageName;
  closeMobileMenu();
  saveState();
  
  // Update title
  const titles = {
    today: 'Vandaag',
    agenda: 'Agenda',
    tasks: 'Taken',
    challenges: 'Challenges',
    mealplan: 'Weekmenu',
    groceries: 'Boodschappen',
    stock: 'Voorraad',
    home: 'Woning',
    budget: 'Budget',
    dates: 'Date Ideeën',
    travel: 'Reizen',
    extras: 'Extra',
    settings: 'Instellingen'
  };
  $('#pageTitle').textContent = titles[pageName];
}

/* ====== FOCUS ====== */
function renderFocus() {
  const el = $('#focus-current');
  if (state.focus) {
    el.classList.remove('empty-state');
    el.textContent = `✦ ${state.focus}`;
  } else {
    el.classList.add('empty-state');
    el.textContent = 'Nog geen focus gekozen.';
  }
}

/* ====== TASKS ====== */
function renderTasks() {
  const list = $('#task-list');
  list.innerHTML = '';
  state.tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = `task-row ${task.done ? 'is-done' : ''}`;
    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-index="${i}" aria-label="Taak afvinken">
      <label class="task-label">${escapeHtml(task.text)}</label>
      <button class="task-delete" data-index="${i}" aria-label="Taak verwijderen">×</button>
    `;
    list.appendChild(li);
  });
  $('#task-count').textContent = `${state.tasks.filter(t => !t.done).length} openstaande taak(en)`;
}

function addTask(text) {
  if (!text.trim()) return;
  state.tasks.unshift({ text: text.trim(), done: false });
  $('#task-input').value = '';
  renderTasks();
  saveState();
}

function toggleTask(index) {
  state.tasks[index].done = !state.tasks[index].done;
  renderTasks();
  saveState();
}

function deleteTask(index) {
  state.tasks.splice(index, 1);
  renderTasks();
  saveState();
}

/* ====== UI HELPERS ====== */
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function toast(msg) {
  const region = $('#toast-region');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  region.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function closeMobileMenu() {
  $('.sidebar').classList.remove('is-open');
  $('#mobile-scrim').classList.remove('is-visible');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
}

/* ====== EVENT LISTENERS ====== */
document.addEventListener('DOMContentLoaded', () => {
  renderFocus();
  renderTasks();
  showPage(state.currentPage);

  // Focus form
  $('#focus-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.focus = $('#focus-input').value.trim();
    $('#focus-input').value = '';
    renderFocus();
    saveState();
  });

  // Task form
  $('#task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTask($('#task-input').value);
  });

  // Task interactions
  $('#task-list').addEventListener('change', (e) => {
    if (e.target.classList.contains('task-check')) {
      toggleTask(parseInt(e.target.dataset.index));
    }
  });
  $('#task-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('task-delete')) {
      deleteTask(parseInt(e.target.dataset.index));
    }
  });

  // Page navigation
  $$('.nav-item, .mobile-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      showPage(btn.dataset.pageLink);
    });
  });

  // Mobile menu
  $('#menu-toggle').addEventListener('click', () => {
    const isOpen = $('.sidebar').classList.toggle('is-open');
    $('#mobile-scrim').classList.toggle('is-visible', isOpen);
    $('#menu-toggle').setAttribute('aria-expanded', isOpen);
  });
  $('#mobile-scrim').addEventListener('click', closeMobileMenu);

  // Quick add
  $('#quick-add-open').addEventListener('click', () => {
    $('#quick-add-dialog').showModal();
  });
  $('#quick-add-dialog').addEventListener('close', () => {
    /* cleanup */
  });
  $$('.quick-add-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.quickAction;
      $('#quick-add-dialog').close();
      if (action === 'task') $('#task-input').focus();
      if (action === 'focus') $('#focus-input').focus();
      toast(`${action} mode geactiveerd`);
    });
  });
});
