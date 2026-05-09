const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'trip.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const initialState = {
  trip: {
    title: 'Malaysia Family Trip 2026',
    travellers: 4,
    departure: '2026-05-25',
    return: '2026-06-03'
  },
  notes: {},
  suggestions: [],
  personalNotes: {},
  lastUpdate: Date.now(),
  version: 1
};

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialState, null, 2));
  }
}

function readState() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { ...initialState };
  }
}

let writeQueue = Promise.resolve();
function writeState(state) {
  state.lastUpdate = Date.now();
  state.version = (state.version || 0) + 1;
  writeQueue = writeQueue.then(() => new Promise((resolve) => {
    fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), () => resolve());
  }));
  return state;
}

app.get('/api/state', (req, res) => {
  const state = readState();
  res.json(state);
});

app.get('/api/sync', (req, res) => {
  const state = readState();
  res.json({ lastUpdate: state.lastUpdate, version: state.version });
});

app.post('/api/notes', (req, res) => {
  const { dayId, text, author } = req.body || {};
  if (!dayId) return res.status(400).json({ error: 'dayId required' });
  const state = readState();
  state.notes[dayId] = {
    text: text || '',
    author: author || 'Family',
    updatedAt: Date.now()
  };
  writeState(state);
  res.json({ ok: true, note: state.notes[dayId], lastUpdate: state.lastUpdate });
});

app.post('/api/suggestions', (req, res) => {
  const { name, day, text } = req.body || {};
  if (!name || !text) return res.status(400).json({ error: 'name and text required' });
  const state = readState();
  const suggestion = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.slice(0, 40),
    day: (day || 'General').slice(0, 60),
    text: text.slice(0, 500),
    upvotes: 0,
    downvotes: 0,
    voters: {},
    timestamp: new Date().toISOString()
  };
  state.suggestions.unshift(suggestion);
  writeState(state);
  res.json({ ok: true, suggestion });
});

app.post('/api/suggestions/:id/vote', (req, res) => {
  const { id } = req.params;
  const { vote, deviceId } = req.body || {};
  if (!['up', 'down'].includes(vote)) return res.status(400).json({ error: 'bad vote' });
  const state = readState();
  const s = state.suggestions.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'not found' });
  s.voters = s.voters || {};
  const prev = s.voters[deviceId];
  if (prev === vote) {
    if (vote === 'up') s.upvotes = Math.max(0, s.upvotes - 1);
    else s.downvotes = Math.max(0, s.downvotes - 1);
    delete s.voters[deviceId];
  } else {
    if (prev === 'up') s.upvotes = Math.max(0, s.upvotes - 1);
    if (prev === 'down') s.downvotes = Math.max(0, s.downvotes - 1);
    if (vote === 'up') s.upvotes++;
    else s.downvotes++;
    s.voters[deviceId] = vote;
  }
  writeState(state);
  res.json({ ok: true, suggestion: s });
});

app.delete('/api/suggestions/:id', (req, res) => {
  const { id } = req.params;
  const state = readState();
  state.suggestions = state.suggestions.filter(s => s.id !== id);
  writeState(state);
  res.json({ ok: true });
});

app.post('/api/personal-notes', (req, res) => {
  const { deviceId, text } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
  const state = readState();
  state.personalNotes[deviceId] = { text: text || '', updatedAt: Date.now() };
  writeState(state);
  res.json({ ok: true });
});

app.get('/api/personal-notes/:deviceId', (req, res) => {
  const state = readState();
  res.json(state.personalNotes[req.params.deviceId] || { text: '', updatedAt: 0 });
});

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`\n  Malaysia Family Trip Planner`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Share this URL with the family on the same network.\n`);
});
