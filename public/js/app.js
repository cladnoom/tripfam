/* ─────────────────────────────────────────────────────────
   Malaysia Family Trip — frontend
   Real-time-ish sync via polling every 8 s.
   ───────────────────────────────────────────────────────── */

const API = {
  state:     '/api/state',
  sync:      '/api/sync',
  notes:     '/api/notes',
  suggest:   '/api/suggestions',
  personal:  '/api/personal-notes'
};
const POLL_MS = 8000;
const NOTE_DEBOUNCE = 700;

// ── Local identity ─────────────────────────────────────
const Me = {
  get name()     { return localStorage.getItem('me-name') || ''; },
  set name(v)    { localStorage.setItem('me-name', v); },
  get device()   {
    let d = localStorage.getItem('me-device');
    if (!d) {
      d = 'd_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem('me-device', d);
    }
    return d;
  }
};

// ── Tag style map ──────────────────────────────────────
const TAG_COLOURS = {
  'Must-do':  '#b45309',
  'Free':     '#15803d',
  'Food':     '#be123c',
  'Tip':      '#6d28d9',
  'Pick one': '#b45309',
  'Transfer': '#1e40af',
  'Arrive':   '#525252'
};

// ── App state ──────────────────────────────────────────
const App = {
  state: null,
  activeCity: 'kl',
  hotelFilter: 'all',
  lastVersion: 0,
  polling: null,
  noteTimers: {},
  personalTimer: null,
  sugVotes: {} // local cache of {sugId: 'up'|'down'} for instant UI
};

// ── DOM helpers ────────────────────────────────────────
const $  = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const el = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
};
const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

// ── Time helpers ───────────────────────────────────────
function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 30) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  return Math.max(0, Math.round((target - today) / 86400000));
}

// ── Toast ──────────────────────────────────────────────
function toast(msg, kind = 'info', ms = 3200) {
  const t = el(`<div class="toast ${kind === 'success' ? 'success' : kind === 'error' ? 'error' : ''}">${escape(msg)}</div>`);
  $('#toastStack').appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = 0;
    t.style.transform = 'translateY(8px)';
    setTimeout(() => t.remove(), 300);
  }, ms);
}

// ── API ────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    method: opts.method || (opts.body ? 'POST' : 'GET')
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

// ── Render city tabs ──────────────────────────────────
function renderTabs() {
  const root = $('#cityTabs');
  root.innerHTML = '';
  TRIP_DATA.cities.forEach(city => {
    const tab = el(`
      <button class="tab ${city.id === App.activeCity ? 'active' : ''}" data-city="${city.id}" data-accent="${city.accent}">
        <span class="tab-name">${escape(city.name)}</span>
        <span class="tab-meta">${escape(city.dates)} · ${city.nights}N</span>
      </button>
    `);
    tab.addEventListener('click', () => {
      App.activeCity = city.id;
      renderTabs();
      renderItinerary();
      window.scrollTo({ top: $('#itinerary').offsetTop - 80, behavior: 'smooth' });
    });
    root.appendChild(tab);
  });
}

// ── Render itinerary ───────────────────────────────────
function renderItinerary() {
  const root = $('#itinerary');
  root.innerHTML = '';

  const city = TRIP_DATA.cities.find(c => c.id === App.activeCity);
  if (!city) return;

  // city hero
  const hero = el(`
    <div class="city-hero" style="--city-gradient: ${city.heroGradient}">
      <div class="city-hero-eyebrow">${escape(city.dates)}</div>
      <h2 class="city-hero-title">${escape(city.name)}</h2>
      <p class="city-hero-sub">${escape(city.tagline)}</p>
      <div class="city-hero-row">
        <span class="city-pill">${city.nights} nights</span>
        <span class="city-pill">${city.days.length} days</span>
        <span class="city-pill">${TRIP_DATA.trip.travellers}</span>
      </div>
    </div>
  `);
  root.appendChild(hero);

  // transfer banner BEFORE arrivals (skip the very first city)
  const cityIdx = TRIP_DATA.cities.findIndex(c => c.id === city.id);
  if (cityIdx > 0) {
    const transfer = TRIP_DATA.transfers.find(t => t.to === city.id);
    if (transfer) {
      root.appendChild(el(`
        <div class="transfer-banner">
          <div>
            <strong>${escape(transfer.date)} — ${escape(transfer.mode)}</strong> from ${escape(TRIP_DATA.cities.find(c => c.id === transfer.from).name)}<br/>
            <span style="opacity:.85;font-size:12.5px">${escape(transfer.detail)}</span>
          </div>
        </div>
      `));
    }
  }

  // days
  const cityColour = city.accent === 'amber' ? '#b45309'
                  : city.accent === 'teal'  ? '#0f766e'
                  : '#1d4ed8';

  city.days.forEach((day, idx) => {
    const note = App.state?.notes?.[day.id] || { text: '', author: '', updatedAt: 0 };
    const isOpen = idx === 0; // open first by default

    const card = el(`
      <article class="day-card ${isOpen ? 'open' : ''}" data-day="${day.id}" style="--day-color:${cityColour}">
        <header class="day-head">
          <div class="day-num">${String(day.number).padStart(2, '0')}</div>
          <div class="day-text">
            <div class="day-date">${escape(day.date)}</div>
            <h3 class="day-title">${escape(day.title)}</h3>
            <p class="day-sub">${escape(day.subtitle)}</p>
          </div>
          <button class="day-toggle" aria-label="Toggle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </header>
        <div class="day-body">
          <div class="day-inner">
            <ul class="act-list">
              ${day.activities.map(a => `
                <li class="act">
                  <span class="act-tag" style="--tag-col:${TAG_COLOURS[a.tag] || '#525252'}">${escape(a.tag)}</span>
                  <div class="act-text">
                    ${escape(a.text)}
                    ${a.detail ? `<span class="act-detail">${escape(a.detail)}</span>` : ''}
                  </div>
                </li>
              `).join('')}
            </ul>

            <div class="notes-block">
              <div class="notes-head">
                <span class="notes-label">Family notes</span>
                <span class="notes-meta" data-meta="${day.id}">${note.author ? `${escape(note.author)} · ${timeAgo(new Date(note.updatedAt).toISOString())}` : 'Be the first to write something'}</span>
              </div>
              <textarea class="notes-input" data-note="${day.id}" placeholder="Restaurants we want to try, things we're worried about, packing reminders…">${escape(note.text)}</textarea>
            </div>
          </div>
        </div>
      </article>
    `);

    // toggle
    card.querySelector('.day-head').addEventListener('click', (e) => {
      if (e.target.closest('.notes-input')) return;
      card.classList.toggle('open');
    });

    // notes — debounced save
    const ta = card.querySelector('textarea');
    ta.addEventListener('input', () => {
      const dayId = day.id;
      clearTimeout(App.noteTimers[dayId]);
      App.noteTimers[dayId] = setTimeout(async () => {
        try {
          const author = Me.name || 'Anonymous';
          await api(API.notes, { body: { dayId, text: ta.value, author }});
          const meta = card.querySelector(`[data-meta="${dayId}"]`);
          if (meta) meta.textContent = `${author} · just now`;
        } catch (err) {
          toast('Could not save note. Will retry…', 'error');
        }
      }, NOTE_DEBOUNCE);
    });

    root.appendChild(card);
  });
}

// ── Render hotels ──────────────────────────────────────
function renderHotels() {
  const root = $('#hotelList');
  root.innerHTML = '';

  const filtered = TRIP_DATA.hotels.filter(h =>
    App.hotelFilter === 'all' || h.type === App.hotelFilter
  );

  if (filtered.length === 0) {
    root.appendChild(el('<div class="sug-empty">No hotels match this filter.</div>'));
    return;
  }

  const cityOrder = ['kl', 'penang', 'langkawi'];
  const cityGradients = {
    kl:       'linear-gradient(135deg, #d97706, #b45309)',
    penang:   'linear-gradient(135deg, #14b8a6, #0f766e)',
    langkawi: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  };

  cityOrder.forEach(cityId => {
    const cityHotels = filtered.filter(h => h.city === cityId);
    if (cityHotels.length === 0) return;
    root.appendChild(el(`<div class="hotel-group-label">${escape(cityHotels[0].cityName)}</div>`));

    cityHotels.forEach(hotel => {
      const card = el(`
        <article class="hotel-card">
          <div class="hotel-thumb" style="--thumb-grad:${cityGradients[hotel.city]}"></div>
          <div class="hotel-info">
            <h4 class="hotel-name">${escape(hotel.name)}</h4>
            <p class="hotel-loc">${escape(hotel.location)}</p>
            <div class="hotel-meta-row">
              <span class="hotel-price">$${hotel.price}<span class="hotel-price-sub"> / night</span></span>
              <span class="hotel-type-badge ${hotel.type}">${hotel.type === 'mid' ? 'Mid' : hotel.type}</span>
            </div>
            <div class="hotel-expand">
              <ul class="hotel-pros">
                ${hotel.pros.map(p => `<li>${escape(p)}</li>`).join('')}
              </ul>
              <div class="hotel-fit">
                <strong>Family fit</strong>${escape(hotel.familyFit)}
              </div>
              <a class="hotel-link" href="${escape(hotel.link)}" target="_blank" rel="noopener">
                View on booking site
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M9 7h8v8"/></svg>
              </a>
            </div>
          </div>
          <button class="hotel-card-toggle" aria-label="Expand">+</button>
        </article>
      `);
      const toggle = card.querySelector('.hotel-card-toggle');
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('expanded');
        toggle.textContent = card.classList.contains('expanded') ? '−' : '+';
      });
      // also expand on card body click
      card.querySelector('.hotel-info').addEventListener('click', () => {
        card.classList.toggle('expanded');
        toggle.textContent = card.classList.contains('expanded') ? '−' : '+';
      });
      root.appendChild(card);
    });
  });
}

// ── Hotel filters ──────────────────────────────────────
function bindHotelFilters() {
  $$('#hotelFilters .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#hotelFilters .pill').forEach(b => b.classList.remove('pill-active'));
      btn.classList.add('pill-active');
      App.hotelFilter = btn.dataset.filter;
      renderHotels();
    });
  });
}

// ── Suggestions ────────────────────────────────────────
function renderSuggestions() {
  const list = $('#sugList');
  list.innerHTML = '';
  const sugs = App.state?.suggestions || [];
  $('#sugCount').textContent = sugs.length;

  if (sugs.length === 0) {
    list.appendChild(el('<div class="sug-empty">No suggestions yet — be the first to add one.</div>'));
    return;
  }

  sugs.forEach(s => {
    const myVote = s.voters?.[Me.device];
    const card = el(`
      <article class="sug" data-sug="${s.id}">
        <div class="sug-head">
          <span class="sug-author">${escape(s.name)}</span>
          ${s.day ? `<span class="sug-day">${escape(s.day)}</span>` : ''}
          <span class="sug-time">${timeAgo(s.timestamp)}</span>
        </div>
        <p class="sug-text">${escape(s.text)}</p>
        <div class="sug-actions">
          <button class="vote-btn ${myVote === 'up' ? 'active-up' : ''}" data-vote="up">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7"/></svg>
            <span>${s.upvotes || 0}</span>
          </button>
          <button class="vote-btn ${myVote === 'down' ? 'active-down' : ''}" data-vote="down">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17"/></svg>
            <span>${s.downvotes || 0}</span>
          </button>
          ${s.name === Me.name ? '<button class="sug-delete">delete</button>' : ''}
        </div>
      </article>
    `);

    card.querySelectorAll('[data-vote]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await api(`${API.suggest}/${s.id}/vote`, { body: { vote: btn.dataset.vote, deviceId: Me.device }});
          await loadState();
          renderSuggestions();
        } catch { toast('Vote failed', 'error'); }
      });
    });
    const del = card.querySelector('.sug-delete');
    if (del) {
      del.addEventListener('click', async () => {
        if (!confirm('Delete this suggestion?')) return;
        try {
          await api(`${API.suggest}/${s.id}`, { method: 'DELETE' });
          await loadState();
          renderSuggestions();
        } catch { toast('Delete failed', 'error'); }
      });
    }
    list.appendChild(card);
  });
}

function bindSuggestionForm() {
  $('#sugForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!Me.name) { openNameModal(); return; }
    const day = $('#sugDay').value.trim();
    const text = $('#sugText').value.trim();
    if (!text) return;
    try {
      await api(API.suggest, { body: { name: Me.name, day, text }});
      $('#sugText').value = '';
      $('#sugDay').value = '';
      await loadState();
      renderSuggestions();
      toast(`Suggestion posted as ${Me.name}`, 'success');
    } catch { toast('Could not post suggestion', 'error'); }
  });
}

// ── Personal notes (drawer) ────────────────────────────
function bindDrawer() {
  const drawer = $('#notesDrawer');
  const backdrop = $('#drawerBackdrop');
  const open = () => { drawer.classList.add('show'); backdrop.classList.add('show'); loadPersonal(); };
  const close = () => { drawer.classList.remove('show'); backdrop.classList.remove('show'); };
  $('#fabNotes').addEventListener('click', open);
  $('#closeDrawer').addEventListener('click', close);
  backdrop.addEventListener('click', close);

  const pad = $('#personalPad');
  // local first
  pad.value = localStorage.getItem('me-personal') || '';
  pad.addEventListener('input', () => {
    localStorage.setItem('me-personal', pad.value);
    $('#personalSaveStatus').textContent = 'Saving…';
    clearTimeout(App.personalTimer);
    App.personalTimer = setTimeout(async () => {
      try {
        await api(API.personal, { body: { deviceId: Me.device, text: pad.value }});
        $('#personalSaveStatus').textContent = `Saved · ${new Date().toLocaleTimeString()}`;
      } catch {
        $('#personalSaveStatus').textContent = 'Saved on this device only';
      }
    }, 500);
  });
}

async function loadPersonal() {
  try {
    const r = await api(`${API.personal}/${Me.device}`);
    const pad = $('#personalPad');
    if (r.text && r.text !== pad.value) pad.value = r.text;
  } catch { /* ignore — local copy is fine */ }
}

// ── Share modal ────────────────────────────────────────
function bindShare() {
  const m = $('#shareModal');
  $('#shareBtn').addEventListener('click', () => {
    $('#shareUrl').value = window.location.href;
    m.classList.add('show');
  });
  $('#closeShare').addEventListener('click', () => m.classList.remove('show'));
  m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('show'); });
  $('#copyLink').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#shareUrl').value);
      toast('Link copied — share with the family', 'success');
    } catch {
      $('#shareUrl').select();
      document.execCommand('copy');
      toast('Link copied', 'success');
    }
  });
}

// ── Name modal ─────────────────────────────────────────
function openNameModal() {
  const m = $('#nameModal');
  m.classList.add('show');
  $('#nameInput').focus();
}
function bindNameModal() {
  $('#meBtn').addEventListener('click', openNameModal);
  $('#saveName').addEventListener('click', () => {
    const v = $('#nameInput').value.trim();
    if (!v) return;
    Me.name = v;
    $('#meName').textContent = v.length > 12 ? v.slice(0, 12) + '…' : v;
    $('#meAvatar').textContent = v.charAt(0).toUpperCase();
    $('#nameModal').classList.remove('show');
    toast(`Hello, ${v}`, 'success');
  });
  $('#nameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('#saveName').click();
  });
}

// ── Sync polling ───────────────────────────────────────
async function loadState() {
  try {
    const s = await api(API.state);
    const wasFirst = !App.state;
    const versionChanged = App.state && s.version !== App.state.version;
    App.state = s;

    if (versionChanged) {
      // re-render dynamic regions (don't blow away note focus)
      const focused = document.activeElement;
      const focusedNoteId = focused?.dataset?.note;
      const focusedSelStart = focused?.selectionStart;
      const focusedSelEnd = focused?.selectionEnd;

      renderItinerary();
      renderSuggestions();

      if (focusedNoteId) {
        const newTa = document.querySelector(`[data-note="${focusedNoteId}"]`);
        if (newTa) {
          newTa.focus();
          if (focusedSelStart != null) newTa.setSelectionRange(focusedSelStart, focusedSelEnd);
          // expand its day card if it got collapsed
          newTa.closest('.day-card')?.classList.add('open');
        }
      }
      toast('Family update synced', 'info', 2200);
    }
    setSyncBadge('ok');
  } catch (err) {
    setSyncBadge('error');
  }
}

function setSyncBadge(state) {
  const b = $('#syncBadge');
  b.classList.remove('syncing', 'error');
  if (state === 'syncing') b.classList.add('syncing');
  if (state === 'error')   b.classList.add('error');
  $('.sync-text', b).textContent = state === 'error' ? 'Offline' : state === 'syncing' ? 'Syncing' : 'Live';
}

function startPolling() {
  if (App.polling) clearInterval(App.polling);
  App.polling = setInterval(async () => {
    setSyncBadge('syncing');
    try {
      const sync = await api(API.sync);
      if (sync.version !== App.state?.version) {
        await loadState();
      } else {
        setSyncBadge('ok');
      }
    } catch {
      setSyncBadge('error');
    }
  }, POLL_MS);
}

// ── Countdown ──────────────────────────────────────────
function updateCountdown() {
  $('#countdown').textContent = daysUntil('2026-05-25');
}

// ── Boot ───────────────────────────────────────────────
async function boot() {
  // local identity reflection
  if (Me.name) {
    $('#meName').textContent = Me.name.length > 12 ? Me.name.slice(0, 12) + '…' : Me.name;
    $('#meAvatar').textContent = Me.name.charAt(0).toUpperCase();
  }

  renderTabs();
  bindHotelFilters();
  bindSuggestionForm();
  bindDrawer();
  bindShare();
  bindNameModal();
  updateCountdown();

  await loadState();
  renderItinerary();
  renderHotels();
  renderSuggestions();

  // gentle nudge to set name on first visit
  if (!Me.name) {
    setTimeout(() => openNameModal(), 800);
  }

  startPolling();
}

document.addEventListener('DOMContentLoaded', boot);

// keep timestamps fresh-ish
setInterval(() => {
  $$('.sug-time').forEach(t => {
    /* no-op — would re-render, but fine to leave static between syncs */
  });
}, 30000);
